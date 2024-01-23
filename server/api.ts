import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
const router = express.Router();

import ItemModel from "./models/Item";
import LinkModel from "./models/Link";
import TagModel from "./models/Tag";

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
  _id: string;
  user_id: string;
};

type FavoriteItemType = {
  picture: string;
  stars: number;
  name: string;
  description: string;
  links: string[];
  tags: string[];
};

/*const defaultFavorites: FavoriteItemType[] = [
  {
    picture: "floofy_cat_picture",
    stars: 4,
    name: "Floofy Cats",
    description:
      "This is a description about why floofy cats are so cute. I like floofy cats because they’re soft and cute. Woohoo :) I like cute things. cute things are very cute. yay. Beep boop yay!",
    links: [
      "https://play.google.com/store/apps/details?id=cat.wallpaper.backgrounds&hl=en_US&pli=1",
    ],
    tags: ["animals", "cute things"],
  },
  {
    picture: "penguin_picture",
    stars: 3,
    name: "Penguins",
    description:
      "I love penguins. look at them. so wonderful. yay :) did you know that some random person on a cruise tried to sneak a penguin back home? He kept the penguin in his bathroom, but it was so stinky that the staff found the penguin. Moral of the story: if you want to escape kidnapping, just be very stinky, or something :shrug:",
    links: ["https://www.vox.com/2015/1/20/7861749/penguins-explained"],
    tags: ["animals", "cute things"],
  },
  {
    picture: "big_bang_picture",
    stars: 5,
    name: "The Big Bang Theory",
    description: "I mean, explosions are great, so naturally, big explosions are even greater.",
    links: ["https://www.space.com/25126-big-bang-theory.html"],
    tags: ["science"],
  },
];*/

const defaultItem = {
  picture: "N/A.",
  stars: 0,
  name: "Your Favorite Thing",
  description: "Super amazing",
  links: [],
  tags: [],
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

  ItemModel.find({ user_id: user_id }).then((items) => {
    if (items.length == 0) {
      res.send(defaultItem);
    } else {
      const randIndex = Math.floor(Math.random() * items.length);
      const favItem: ItemType = items[randIndex];
      LinkModel.find({ parent_id: favItem._id }).then((links) => {
        TagModel.find({ parent_id: favItem._id }).then((tags) => {
          const fullItem: FavoriteItemType = {
            picture: favItem.picture,
            stars: favItem.stars,
            name: favItem.name,
            description: favItem.description,
            links: links.map((link) => link.link),
            tags: tags.map((tag) => tag.tag),
          };
          res.send(fullItem);
        });
      });
    }
  });
});

router.get("/favorites", auth.ensureLoggedIn, async (req, res) => {
  const user_id = req.user?._id;

  ItemModel.find({ user_id: user_id }).then(async (items) => {
    if (items.length == 0) {
      res.send([]);
    } else {
      const shuffledItems: ItemType[] = shuffleArray(items);
      const shuffledFullItems = shuffledItems.map((favItem) => {
        return LinkModel.find({ parent_id: favItem._id }).then((links) => {
          return TagModel.find({ parent_id: favItem._id }).then((tags) => {
            const fullItem: FavoriteItemType = {
              picture: favItem.picture,
              stars: favItem.stars,
              name: favItem.name,
              description: favItem.description,
              links: links.map((link) => link.link),
              tags: tags.map((tag) => tag.tag),
            };
            return fullItem;
          });
        });
      });
      res.send(await Promise.all(shuffledFullItems));
    }
  }); // TODO: Check how regexes work to fix this, look in req.query for stuff
  // TODO: Also check how we want filters to work: remove everything that doesn't have any of the tags, or keep only things with all tags?
});

router.post("/addFavorite", auth.ensureLoggedIn, (req, res) => {
  const user_id = req.user?._id;
  const newFavorite = new ItemModel({
    picture: req.body.newFav.picture,
    stars: req.body.newFav.stars,
    name: req.body.newFav.name,
    description: req.body.newFav.description,
    user_id: user_id,
  });
  newFavorite.save().then((savedItem) => {
    console.log(req.body.newFav);
    const newLinks = req.body.newFav.links.map(
      (link) =>
        new LinkModel({
          link: link,
          parent_id: savedItem._id,
        })
    );
    const newTags = req.body.newFav.tags.map(
      (tag) => new TagModel({ tag: tag, parent_id: savedItem._id })
    );
    res.send(
      Promise.all(
        newLinks.map((linkModel) => linkModel.save()) + newTags.map((tagModel) => tagModel.save())
      ).then(() => req.body.newFav)
    );
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
