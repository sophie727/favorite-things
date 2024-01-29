import React, { useState, useEffect } from "react";

import "./Home.css";
import DailyFavorite from "../modules/DailyFavorite";
import UtilBar from "../modules/UtilBar";
import FavoriteItem from "../modules/FavoriteItem";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";

type Props = { tagOptions: string[]; userId: string };

type fullItem = {
  picture: string;
  stars: number;
  name: string;
  description: string;
  link: string;
  tags: string[];
  private: boolean;
  id: string;
};

const Home = (props: Props) => {
  const defaultItem = {
    picture: "N/A.",
    stars: 0,
    name: "Your Favorite Thing",
    description: "Super amazing",
    link: "",
    tags: [],
    private: false,
    id: "no_id",
  };

  const [dailyFavorite, setDailyFavorite] = useState<fullItem>(defaultItem);
  const [favoriteItems, setFavoriteItems] = useState<fullItem[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    get("/api/dailyFav").then((item) => setDailyFavorite(item));
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

  const addFavorite = (newFav: fullItem, user_id: string) => {
    if (user_id !== props.userId) {
      console.log(user_id, props.userId);
      return;
    }
    console.log(newFav.id, "adding");
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

  const delFavorite = (id: string) => {
    if (dailyFavorite.id === id) {
      get("/api/dailyFav").then((item) => {
        setDailyFavorite(item);
      });
    }
    console.log(id, "deleting");
    setFavoriteItems(favoriteItems.filter((favItem) => favItem.id !== id));
  };

  useEffect(() => {
    socket.on("delFav", delFavorite);
    return () => {
      socket.off("delFav", delFavorite);
    };
  });

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
          favoriteItems.map((item, index) => {
            let addLink = "./add";
            addLink += "?picture=" + item.picture;
            addLink += "&stars=" + item.stars;
            addLink += "&name=" + item.name;
            addLink += "&description=" + item.description;
            addLink += "&link=" + item.link;
            addLink += "&tags=" + item.tags.join(",");
            addLink += "&private=" + item.private;
            addLink += "&oldId=" + item.id;
            return (
              <div className="HomeFavoriteItemContainer u-flex" key={index}>
                <div className="HomeFavoriteItem">
                  {" "}
                  <FavoriteItem item={item} />
                </div>
                <div className="smallTexts">
                  <div className="smallText"> {item.private ? "Private" : "Public"}</div>
                  <div>
                    <a className="smallText" href={addLink}>
                      Edit
                    </a>
                  </div>
                  <div>
                    <button
                      className="HomeDelete"
                      onClick={() => {
                        console.log("deleted", item);
                        post("/api/delFav", { id: item.id });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Home;
