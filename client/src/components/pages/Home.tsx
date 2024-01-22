import React, { useState, useEffect } from "react";

import "./Home.css";
import DailyFavorite from "../modules/DailyFavorite";
import UtilBar from "../modules/UtilBar";
import FavoriteItem from "../modules/FavoriteItem";

type Props = {};

type Item = {
  picture: string;
  stars: number;
  name: string;
  description: string;
  links: string[];
  tags: string[];
};

const Home = (props: Props) => {
  const [dailyFavorite, setDailyFavorite] = useState({
    picture: "floofy_cat_picture",
    stars: 4,
    name: "Floofy Cats",
    description:
      "This is a description about why floofy cats are so cute. I like floofy cats because they’re soft and cute. Woohoo :) I like cute things. cute things are very cute. yay. Beep boop yay!",
    links: [
      "https://play.google.com/store/apps/details?id=cat.wallpaper.backgrounds&hl=en_US&pli=1",
    ],
    tags: ["animals", "cute things"],
  });

  const defaultFavorites = [
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
      description:
        "I mean, explosions are great, so naturally, big explosions are even greater.",
      links: ["https://www.space.com/25126-big-bang-theory.html"],
      tags: ["science"],
    },
  ];

  const [favoriteItems, setFavoriteItems] = useState(defaultFavorites);
  return (
    <>
      <div>
        <DailyFavorite item={dailyFavorite} />
      </div>
      <div>
        <UtilBar />
      </div>
      <div>
        {favoriteItems.map((item, index) => (
          <div className="HomeFavoriteItemContainer" key={index}>
            <FavoriteItem item={item} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
