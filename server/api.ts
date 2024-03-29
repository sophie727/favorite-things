import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
const router = express.Router();

import ItemModel from "./models/item";
import TagModel from "./models/tag";
import AllTagModel from "./models/AllTag";
import FriendRequestModel from "./models/FriendRequest";
import ProfileTextModel from "./models/ProfileText";

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // Not logged in.
    return res.send({});
  }
  res.send(req.user);
});
router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    const socket = socketManager.getSocketFromSocketID(req.body.socketid);
    if (socket !== undefined) socketManager.addUser(req.user, socket);
  }
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

type ItemType = {
  picture: string;
  stars: number;
  name: string;
  description: string;
  link: string;
  _id: string;
  user_id: string;
  private: boolean;
};

type FavoriteItemType = {
  picture: string;
  stars: number;
  name: string;
  description: string;
  link: string;
  tags: string[];
  private: boolean;
  id: string;
};

const defaultItem = {
  picture: "N/A.",
  stars: 0,
  name: "Your Favorite Thing",
  description: "Super amazing",
  link: "",
  tags: [],
  private: "Public",
};

const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

router.get("/dailyfav", auth.ensureLoggedIn, async (req, res) => {
  const user_id = req.user?._id;
  const curr_id = req.query.currID as string;
  const query: any = {
    user_id: curr_id,
  };
  if (user_id !== curr_id) {
    query.private = false;
  }

  ItemModel.find(query).then((items) => {
    if (items.length == 0) {
      res.send(defaultItem);
    } else {
      const randIndex = Math.floor(Math.random() * items.length);
      const favItem: ItemType = items[randIndex];
      TagModel.find({ parent_id: favItem._id }).then((tags) => {
        const fullItem: FavoriteItemType = {
          picture: favItem.picture,
          stars: favItem.stars,
          name: favItem.name,
          description: favItem.description,
          link: favItem.link,
          tags: tags.map((tag) => tag.tag),
          private: favItem.private,
          id: favItem._id,
        };
        res.send(fullItem);
      });
    }
  });
});

router.get("/favorites", auth.ensureLoggedIn, async (req, res) => {
  const user_id = req.user?._id;
  const curr_id = req.query.currID as string;
  const searchText = req.query.searchText as string;
  const query: any = {
    user_id: curr_id,
    name: { $regex: searchText, $options: "i" },
  };
  if (user_id !== curr_id) {
    query.private = false;
  }
  console.log("querying", query);

  ItemModel.find(query).then(async (items) => {
    console.log(items);
    if (items.length == 0) {
      res.send([]);
    } else {
      const shuffledItems: ItemType[] = shuffleArray(items);
      const shuffledFullItems = shuffledItems.map((favItem) => {
        return TagModel.find({ parent_id: favItem._id }).then((tags) => {
          const fullItem: FavoriteItemType = {
            picture: favItem.picture,
            stars: favItem.stars,
            name: favItem.name,
            description: favItem.description,
            link: favItem.link,
            tags: tags.map((tag) => tag.tag),
            private: favItem.private,
            id: favItem._id,
          };
          return fullItem;
        });
      });
      const filterTagsString = req.query.filterTags as string;
      const filterTags = filterTagsString.split(",").filter((tag) => tag != "");

      const filteredFullItems = (await Promise.all(shuffledFullItems)).filter((fullItem) => {
        for (const filterTag of filterTags) {
          let missing: boolean = true;
          for (const availableTag of fullItem.tags) {
            if (filterTag === availableTag) {
              missing = false;
              break;
            }
          }
          if (missing) {
            return false;
          }
        }
        return true;
      });
      res.send(filteredFullItems);
    }
  });
});

router.post("/addFavorite", auth.ensureLoggedIn, (req, res) => {
  const user_id = req.user?._id;
  const newFavorite = new ItemModel({
    picture: req.body.newFav.picture,
    stars: req.body.newFav.stars,
    name: req.body.newFav.name,
    description: req.body.newFav.description,
    link: req.body.newFav.link,
    user_id: user_id,
    private: req.body.newFav.private,
  });
  newFavorite.save().then((savedItem) => {
    const newTags = req.body.newFav.tags.map(
      (tag) => new TagModel({ tag: tag, parent_id: savedItem._id })
    );
    const newFav = req.body.newFav;
    newFav.id = savedItem._id;
    socketManager.getIo().emit("addFav", newFav, user_id);
    Promise.all(newTags.map((tagModel) => tagModel.save())).then(() => {
      res.send(newFav);
    });
  });
});

router.post("/delFav", auth.ensureLoggedIn, (req, res) => {
  ItemModel.remove({ _id: req.body.id }).then(() => {
    TagModel.remove({ parent_id: req.body.id }).then(() => {
      socketManager.getIo().emit("delFav", req.body.id);
      res.send(req.body);
    });
  });
});

router.get("/tags", (req, res) => {
  const curr_id = req.query.curr_id as string;
  AllTagModel.find({ user_id: curr_id }).then((tags) => {
    res.send(tags.map((tagObject) => tagObject.tag));
  });
});

router.post("/addTag", auth.ensureLoggedIn, (req, res) => {
  const newTag = new AllTagModel({
    tag: req.body.newTag,
    user_id: req.user?._id,
  });
  newTag.save().then((savedTag) => {
    socketManager.getIo().emit("newTag", savedTag);
    res.send(savedTag);
  });
});

//
// Profile stuff
//

type ProfileType = {
  picture: string;
  name: string;
  description: string;
  friends: string[];
  incomingFriendRequests: string[];
  outgoingFriendRequests: string[];
  user_id: string;
};
const defaultProfile: ProfileType = {
  picture: "https://i.pinimg.com/736x/05/d3/a5/05d3a51c5fa2940a2f0710957f1dbd0d.jpg",
  name: "FirstName LastName",
  description: "Web.lab is the best, 10/10!",
  friends: [],
  incomingFriendRequests: [],
  outgoingFriendRequests: [],
  user_id: "",
};

router.get("/profile", auth.ensureLoggedIn, (req, res) => {
  const curr_id = req.query.user_id as string;
  const user_id = req.user?._id;

  ProfileTextModel.findOne({ user_id: curr_id }).then((profileText) => {
    if (profileText === null) {
      res.send(defaultProfile);
    } else {
      const profile: ProfileType = {
        picture: profileText.picture,
        name: profileText.name,
        description: profileText.description,
        friends: [],
        incomingFriendRequests: [],
        outgoingFriendRequests: [],
        user_id: curr_id,
      };
      if (user_id !== curr_id) {
        res.send(profile);
        return;
      }
      FriendRequestModel.find({ $or: [{ first_id: user_id }, { second_id: user_id }] }).then(
        (friendPairs) => {
          profile.friends = friendPairs
            .filter((friendPair) => friendPair.accepted)
            .map((friendPair) =>
              friendPair.first_id === user_id ? friendPair.second_id : friendPair.first_id
            );
          profile.incomingFriendRequests = friendPairs
            .filter((friendPair) => !friendPair.accepted && friendPair.second_id === user_id)
            .map((friendPair) => friendPair.first_id);
          profile.outgoingFriendRequests = friendPairs
            .filter((friendPair) => !friendPair.accepted && friendPair.first_id === user_id)
            .map((friendPair) => friendPair.second_id);
          res.send(profile);
        }
      );
    }
  });
});

router.post("/profile", auth.ensureLoggedIn, (req, res) => {
  const user_id = req.user?._id;
  ProfileTextModel.remove({ user_id: user_id }).then(() => {
    const newProfileText = new ProfileTextModel({
      picture: req.body.newProfileText.picture,
      name: req.body.newProfileText.name,
      description: req.body.newProfileText.description,
      user_id: user_id,
    });
    console.log(newProfileText);
    newProfileText.save().then((savedProfileText) => {
      socketManager.getIo().emit("profileEdit", {
        picture: savedProfileText.picture,
        name: savedProfileText.name,
        description: savedProfileText.description,
        user_id: savedProfileText.user_id,
      });
      res.send(savedProfileText);
    });
  });
});

router.get("/profiles", auth.ensureLoggedIn, (req, res) => {
  const user_id = req.user?._id;
  const searchText = req.query.searchText as string;
  ProfileTextModel.find({
    user_id: { $ne: user_id },
    name: { $regex: "^" + searchText, $options: "i" },
  }).then((profiles) => {
    res.send(profiles);
  });
});

router.post("/friend", auth.ensureLoggedIn, (req, res) => {
  const user_id = req.user?._id;
  const friend_id = req.body.friend_id;
  FriendRequestModel.find({
    $or: [
      { first_id: user_id, second_id: friend_id },
      { second_id: user_id, first_id: friend_id },
    ],
  }).then((pairs) => {
    if (pairs.length === 0) {
      const newFriendPair = new FriendRequestModel({
        first_id: user_id,
        second_id: friend_id,
        accepted: false,
      });
      newFriendPair.save().then((savedPair) => {
        socketManager.getIo().emit("newFriends", newFriendPair);
        res.send(newFriendPair);
      });
    } else {
      let hasOtherSide = false;
      for (const pair of pairs) {
        if (pair.first_id === friend_id || pair.accepted) {
          hasOtherSide = true;
          break;
        }
      }
      FriendRequestModel.remove({
        $or: [
          { first_id: user_id, second_id: friend_id },
          { second_id: user_id, first_id: friend_id },
        ],
      }).then(() => {
        const newFriendPair = new FriendRequestModel({
          first_id: user_id,
          second_id: friend_id,
          accepted: false,
        });
        if (hasOtherSide) {
          newFriendPair.accepted = true;
        }
        newFriendPair.save().then((savedPair) => {
          socketManager.getIo().emit("newFriends", newFriendPair);
          res.send(newFriendPair);
        });
      });
    }
  });
});

router.post("/unfriend", auth.ensureLoggedIn, (req, res) => {
  const user_id = req.user?._id;
  const friend_id = req.body.friend_id;
  FriendRequestModel.remove({
    $or: [
      { first_id: user_id, second_id: friend_id },
      { second_id: user_id, first_id: friend_id },
    ],
  }).then(() => {
    socketManager.getIo().emit("delFriends", user_id, friend_id);
    res.send({ user_id: user_id, friend_id: friend_id });
  });
});

router.get("/isFriend", auth.ensureLoggedIn, (req, res) => {
  const user_id = req.user?._id;
  const friend_id = req.query.friend_id as string;
  FriendRequestModel.find({
    accepted: true,
    $or: [
      { first_id: user_id, second_id: friend_id },
      { second_id: user_id, first_id: friend_id },
    ],
  }).then((pairs) => {
    res.send(pairs);
  });
});

router.get("/isPending", auth.ensureLoggedIn, (req, res) => {
  const user_id = req.user?._id;
  const friend_id = req.query.friend_id as string;
  FriendRequestModel.find({
    first_id: user_id,
    second_id: friend_id,
    accepted: false,
  }).then((pairs) => {
    res.send(pairs);
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
