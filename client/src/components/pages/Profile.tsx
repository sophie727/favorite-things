import React, { useState, useEffect } from "react";

import "./Profile.css";

type Props = {};

type Item = {
  picture: string;
  name: string;
  description: string;
  friends: string[];
  friendRequests: string[];
};

const Profile = (props: Props) => {
  const defaultItem = {
    picture:
      "https://i.pinimg.com/736x/05/d3/a5/05d3a51c5fa2940a2f0710957f1dbd0d.jpg",
    name: "FirstName LastName",
    description: "Web.design is the best, 10/10!",
    friends: [],
    friendRequests: [],
  };

  const [personalProfile, setPersonalProfile] = useState<Item>(defaultItem);

  return (
    <div className="Profile">
      <div className="ProfileLeftColumn">
        <img className="ProfilePicture" src={personalProfile.picture} />
      </div>
      <div className="ProfileRightColumn">
        <div className="u-flex-alignCenter">
          {" "}
          <h1> Profile</h1>
          <a href="/profile%edit" className="ProfileEditButton">
            Edit
          </a>
        </div>
        <div className="ProfileText">
          {" "}
          <p> Name: {personalProfile.name}</p>
          <p className="ProfileDescription"> {personalProfile.description} </p>
          <p> Friends: {personalProfile.friends} </p>
          <p> Friend Requests: {personalProfile.friends} </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
