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
};
type Props = {};

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

  useEffect(() => {
    get("/api/profile")
      .then((myProfile) => {
        console.log(myProfile);
        setProfile(myProfile);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    socket.on("profileEdit", changeProfileText);
    return () => {
      socket.off("profileEdit", changeProfileText);
    };
  }, []);

  const changeProfileText = (profileText: ProfileText) => {
    console.log(profileText);
    const newProfile = { ...profile };
    newProfile.picture = profileText.picture;
    newProfile.name = profileText.name;
    newProfile.description = profileText.description;
    setProfile(newProfile);
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
          <a href="/profile/edit" className="ProfileEditButton">
            Edit
          </a>
        </div>
        <div className="ProfileText">
          {" "}
          <p> Name: {profile.name}</p>
          <p className="ProfileDescription"> {profile.description} </p>
          <div>
            <span> Friends: {profile.friends} </span>
            <button className="ProfileAddButton">
              {" "}
              <a href="/community"> + </a>{" "}
            </button>
          </div>
          <p> Incoming Friend Requests: {profile.incomingFriendRequests} </p>
          <p> Outgoing Friend Requests: {profile.outgoingFriendRequests} </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
