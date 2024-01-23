import React, { useState, useEffect } from "react";

import "./Home.css";
import DailyFavorite from "../modules/DailyFavorite";
import UtilBar from "../modules/UtilBar";
import FavoriteItem from "../modules/FavoriteItem";
import { get } from "../../utilities";

type Props = {};

type Item = {
  picture: string;
  stars: number;
  name: string;
  description: string;
  link: string;
  tags: string[];
};

const Home = (props: Props) => {
  const defaultItem = {
    picture: "N/A.",
    stars: 0,
    name: "Your Favorite Thing",
    description: "Super amazing",
    link: "",
    tags: [],
  };

  const [dailyFavorite, setDailyFavorite] = useState<Item>(defaultItem);
  const [favoriteItems, setFavoriteItems] = useState<Item[]>([]);
  useEffect(() => {
    document.title = "Home";
    get("/api/dailyFav").then((item) => {
      setDailyFavorite(item);
    });
  }, []);

  useEffect(() => {
    get("/api/favorites", { filterTags: [], searchText: "" }).then((items) => {
      setFavoriteItems(items);
      console.log(items);
    });
  }, []);

  return (
    <>
      <div>
        <DailyFavorite item={dailyFavorite} />
      </div>
      <div>
        <UtilBar />
      </div>
      <div>
        {favoriteItems.length > 0 ? (
          favoriteItems.map((item, index) => (
            <div className="HomeFavoriteItemContainer" key={index}>
              <FavoriteItem item={item} />
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Home;
