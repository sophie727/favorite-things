import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
const router = express.Router();

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

type Item = {
  picture: string;
  stars: number;
  name: string;
  description: string;
  links: string[];
  tags: string[];
};

const defaultFav: Item = {
  picture: "floofy_cat_picture",
  stars: 4,
  name: "Floofy Cats",
  description:
    "This is a description about why floofy cats are so cute. I like floofy cats because they’re soft and cute. Woohoo :) I like cute things. cute things are very cute. yay. Beep boop yay!",
  links: ["https://play.google.com/store/apps/details?id=cat.wallpaper.backgrounds&hl=en_US&pli=1"],
  tags: ["animals", "cute things"],
};

const defaultFavorites: Item[] = [
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
];

router.get("/dailyfav", (req, res) => {
  res.send(defaultFav);
});

router.get("/favorites", (req, res) => {
  res.send(defaultFavorites);
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
