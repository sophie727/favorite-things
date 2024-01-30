import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import { socket } from "../../client-socket";

import "./Community.css";
import ProfileBox from "../modules/ProfileBox";

type ProfileText = {
  picture: string;
  name: string;
  description: string;
  user_id: string;
};

type Props = { userId: string };

const Community = (props: Props) => {
  const [profiles, setProfiles] = useState<ProfileText[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    get("/api/profiles", { searchText: searchText }).then(
      (profiles: ProfileText[]) => {
        setProfiles(profiles);
      }
    );
  }, [searchText]);

  useEffect(() => {
    socket.on("profileEdit", changeProfile);
    return () => {
      socket.off("profileEdit", changeProfile);
    };
  }, []);

  const changeProfile = (profileText: ProfileText) => {
    setSearchText((st) => {
      const matches = RegExp("^" + st, "i").test(profileText.name);
      setProfiles((oldProfiles) => {
        if (props.userId === profileText.user_id) {
          return oldProfiles;
        }
        let found = false;
        if (matches) {
          const newProfiles = oldProfiles.map((oldProfile) => {
            if (oldProfile.user_id === profileText.user_id) {
              found = true;
              return profileText;
            } else {
              return oldProfile;
            }
          });
          if (!found) {
            newProfiles.push(profileText);
          }
          return newProfiles;
        } else {
          return oldProfiles.filter(
            (oldProfile) => oldProfile.user_id !== profileText.user_id
          );
        }
      });
      return st;
    });
  };

  const makeFiltersDropdown = () => {
    var popup = document.getElementById("FilterPopup");
    popup?.classList.toggle("show");
  };

  return (
    <div>
      <h1 className="CommunityTitle"> Community </h1>
      <div className="UtilBarContainer">
        <div>
          <button
            className="UtilBarItem UtilBarButton UtilBarFilter"
            onClick={makeFiltersDropdown}
          >
            Sort
            <div className="UtilBarPopupTextContainer CommunitySortContainer">
              <div className="UtilBarPopupText" id="FilterPopup">
                <p>Sort by: </p>
                <input type="checkbox" />
                Alphabetical Order
              </div>
            </div>
          </button>
        </div>

        <div>
          {" "}
          <input
            className="SearchBar"
            placeholder=" Search"
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
          />
        </div>
      </div>
      {profiles.map((profile) => (
        <div className="HomeFavoriteItemContainer">
          <ProfileBox item={profile}></ProfileBox>
        </div>
      ))}
    </div>
  );
};

export default Community;
