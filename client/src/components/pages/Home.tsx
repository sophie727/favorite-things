import React, { useState, useEffect } from "react";

import "./Home.css";
import DailyFavorite from "../modules/DailyFavorite";
import UtilBar from "../modules/UtilBar";
import FavoriteItem from "../modules/FavoriteItem";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";

type Props = {
  tagOptions: string[];
  userId: string;
  currID: string;
  setCurrID: React.Dispatch<React.SetStateAction<string>>;
};

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
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    get("/api/dailyFav", { currID: props.currID }).then((item) => {
      props.setCurrID((id) => {
        if (props.currID === id) {
          console.log("setting daily fav");
          setDailyFavorite(item);
        }
        return id;
      });
    });
    if (props.currID !== props.userId) {
      get("/api/isFriend", { friend_id: props.currID }).then((pairs) => {
        props.setCurrID((id) => {
          if (props.currID === id) {
            setIsFriend(pairs.length > 0);
          }
          return id;
        });
      });
    }
  }, [props.currID]);

  useEffect(() => {
    get("/api/favorites", {
      filterTags: filterTags,
      searchText: searchText,
      currID: props.currID,
    }).then((items) => {
      props.setCurrID((id) => {
        console.log(id, props.currID);
        if (props.currID === id) {
          setFavoriteItems(items);
          console.log(items);
        }
        return id;
      });
    });
  }, [filterTags, searchText, props.currID]);

  const addFavorite = (newFav: fullItem, user_id: string) => {
    props.setCurrID((id) => {
      if (user_id !== id) {
        return id;
      }
      if (newFav.private && user_id != props.userId) {
        return id;
      }
      console.log(newFav.id, "adding");
      setFavoriteItems((prevFavorites) => {
        return prevFavorites.concat([newFav]);
      });
      return id;
    });
  };

  useEffect(() => {
    socket.on("addFav", addFavorite);
    return () => {
      socket.off("addFav", addFavorite);
    };
  }, []);

  const delFavorite = (id: string) => {
    get("/api/dailyFav").then((item) => {
      setDailyFavorite((dailyFav) => {
        if (dailyFavorite.id === id) {
          return item;
        }
        return dailyFav;
      });
    });
    console.log(id, "deleting");
    setFavoriteItems((prevFavorites) => prevFavorites.filter((favItem) => favItem.id !== id));
  };

  useEffect(() => {
    socket.on("delFav", delFavorite);
    return () => {
      socket.off("delFav", delFavorite);
    };
  }, []);

  return isFriend || props.userId === props.currID ? (
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
          canAdd={props.currID === props.userId}
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
                    <a className="smallText editButton" href={addLink}>
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
  ) : (
    <h1 className="u-textCenter">You haven't befriended this user yet!</h1>
  );
};

export default Home;
