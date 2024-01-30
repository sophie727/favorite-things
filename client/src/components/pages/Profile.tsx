import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";
import FriendProfileButton from "../modules/FriendProfileButton";

import "./Profile.css";

// TODO: Make things look different when you're friends?

type ProfileType = {
  picture: string;
  name: string;
  description: string;
  friends: string[];
  incomingFriendRequests: string[];
  outgoingFriendRequests: string[];
};
type ProfileText = {
  picture: string;
  name: string;
  description: string;
  user_id: string;
};
type Props = { userId: string };

const defaultProfile: ProfileType = {
  picture: "N/A.",
  name: "FirstName LastName",
  description: "Web.lab is the best, 10/10!",
  friends: [],
  incomingFriendRequests: [],
  outgoingFriendRequests: [],
};

const Profile = (props: Props) => {
  const [profile, setProfile] = useState(defaultProfile);
  const [currID, setCurrID] = useState("");
  const [incomingFriendProfiles, setIncomingFriendProfiles] = useState<ProfileText[]>([]);
  const [outgoingFriendProfiles, setOutgoingFriendProfiles] = useState<ProfileText[]>([]);
  const [friendProfiles, setFriendProfiles] = useState<ProfileText[]>([]);

  useEffect(() => {
    get("/api/profile", { user_id: currID }).then((myProfile) => {
      console.log("got profile for " + currID);
      console.log(myProfile);
      setProfile(myProfile);
    });
  }, [currID]);

  useEffect(() => {
    socket.on("profileEdit", changeProfileText);
    return () => {
      socket.off("profileEdit", changeProfileText);
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const curr_id = urlParams.get("user");
    if (curr_id === null) {
      setCurrID(props.userId);
    } else {
      setCurrID(curr_id);
    }
  }, []);

  const changeProfileText = (profileText: ProfileText) => {
    setCurrID((oldID) => {
      if (oldID == profileText.user_id) {
        setProfile((oldProfile) => {
          const newProfile = { ...oldProfile };
          newProfile.picture = profileText.picture;
          newProfile.name = profileText.name;
          newProfile.description = profileText.description;
          return newProfile;
        });
      }
      return oldID;
    });
  };

  const sendFriendRequest = () => {
    post("/api/friend", { friend_id: currID });
  };

  return (
    <div className="Profile">
      <div className="ProfileLeftColumn">
        <img className="ProfilePicture" src={profile.picture} />
      </div>
      <div className="ProfileRightColumn">
        <div className="u-flex-alignCenter">
          {" "}
          <h1> Profile</h1>
          {currID === props.userId ? (
            <a href="/profile/edit" className="ProfileEditButton">
              Edit
            </a>
          ) : (
            <a className="ProfileAddFriendButton" onClick={sendFriendRequest}>
              {" "}
              Add Friend{" "}
            </a>
          )}
        </div>
        <div className="ProfileText">
          {" "}
          <p> Name: {profile.name}</p>
          <p className="ProfileDescription"> {profile.description} </p>
          {currID === props.userId ? (
            <>
              <div>
                <span>
                  {" "}
                  Friends:{" "}
                  {profile.friends.map((friend: string) => (
                    <FriendProfileButton friend_id={friend} />
                  ))}{" "}
                </span>
                <button className="ProfileAddButton">
                  {" "}
                  <a href="/community"> + </a>{" "}
                </button>
              </div>
              <p>
                {" "}
                Incoming Friend Requests:{" "}
                <div>
                  {" "}
                  {profile.incomingFriendRequests.map((friend: string) => (
                    <FriendProfileButton friend_id={friend} />
                  ))}
                </div>
              </p>
              <p>
                {" "}
                Outgoing Friend Requests:
                <div>
                  {" "}
                  {profile.outgoingFriendRequests.map((friend: string) => (
                    <FriendProfileButton friend_id={friend} />
                  ))}
                </div>
              </p>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
