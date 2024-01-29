import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";

import "./Profile.css";

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
  picture: "https://i.pinimg.com/736x/05/d3/a5/05d3a51c5fa2940a2f0710957f1dbd0d.jpg",
  name: "FirstName LastName",
  description: "Web.design is the best, 10/10!",
  friends: [],
  incomingFriendRequests: [],
  outgoingFriendRequests: [],
};

const Profile = (props: Props) => {
  const [profile, setProfile] = useState(defaultProfile);
  const [currID, setCurrID] = useState("");

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
            <a className="ProfileEditButton"> Add Friend </a>
          )}
        </div>
        <div className="ProfileText">
          {" "}
          <p> Name: {profile.name}</p>
          <p className="ProfileDescription"> {profile.description} </p>
          {currID === props.userId ? (
            <>
              <div>
                <span> Friends: {profile.friends} </span>
                <button className="ProfileAddButton">
                  {" "}
                  <a href="/community"> + </a>{" "}
                </button>
              </div>
              <p> Incoming Friend Requests: {profile.incomingFriendRequests} </p>
              <p> Outgoing Friend Requests: {profile.outgoingFriendRequests} </p>
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
