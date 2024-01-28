import React, { useState, useEffect } from "react";

import "./Home.css";
import DailyFavorite from "../modules/DailyFavorite";
import UtilBar from "../modules/UtilBar";
import FavoriteItem from "../modules/FavoriteItem";
import { get } from "../../utilities";
import { socket } from "../../client-socket";

type Props = { tagOptions: string[]; userId: string };

type Item = {
  picture: string;
  stars: number;
  name: string;
  description: string;
  link: string;
  tags: string[];
  private: string;
};

const Home = (props: Props) => {
  const defaultItem = {
    picture: "N/A.",
    stars: 0,
    name: "Your Favorite Thing",
    description: "Super amazing",
    link: "",
    tags: [],
    private: "Public",
  };

  const [dailyFavorite, setDailyFavorite] = useState<Item>(defaultItem);
  const [favoriteItems, setFavoriteItems] = useState<Item[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    document.title = "Home";
    get("/api/dailyFav").then((item) => {
      setDailyFavorite(item);
    });
  }, []);

  useEffect(() => {
    get("/api/favorites", {
      filterTags: filterTags,
      searchText: searchText,
    }).then((items) => {
      setFavoriteItems(items);
      console.log(items);
    });
  }, [filterTags, searchText]);

  const addFavorite = (newFav: Item, user_id: string) => {
    if (user_id !== props.userId) {
      console.log(user_id, props.userId);
      return;
    }
    setFavoriteItems((prevFavorites) => {
      return prevFavorites.concat([newFav]);
    });
  };

  useEffect(() => {
    socket.on("addFav", addFavorite);
    return () => {
      socket.off("addFav", addFavorite);
    };
  }, []);

  const makePrivate = (s) => {
    if (s == "Private") {
      return "Private";
    } else {
      return "Public";
    }
  };

  return (
    <>
      <div>
        <DailyFavorite item={dailyFavorite} />
      </div>
      <div>
        <UtilBar
          tagOptions={props.tagOptions}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          setSearchText={setSearchText}
        />
      </div>
      <div>
        {favoriteItems.length > 0 ? (
          favoriteItems.map((item, index) => (
            <div className="HomeFavoriteItemContainer u-flex" key={index}>
              <div className="HomeFavoriteItem">
                {" "}
                <FavoriteItem item={item} />
              </div>
              <div className="smallTexts">
                <div className="smallText"> {makePrivate(item.private)}</div>
                <a className="smallText" href="./add">
                  Edit
                </a>
              </div>
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
