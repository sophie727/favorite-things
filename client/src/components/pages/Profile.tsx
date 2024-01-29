import React, { useState, useEffect } from "react";

import "./Profile.css";

type Props = {};

type Item = {
  picture: string;
  name: string;
  description: string;
  friends: string[];
  incomingFriendRequests: string[];
  outgoingFriendRequests: string[];
};

const Profile = (props: Props) => {
  const defaultItem = {
    picture:
      "https://i.pinimg.com/736x/05/d3/a5/05d3a51c5fa2940a2f0710957f1dbd0d.jpg",
    name: "FirstName LastName",
    description: "Web.lab is the best, 10/10!",
    friends: [],
    outgoingFriendRequests: [],
    incomingFriendRequests: [],
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
          <div>
            <span> Friends: {personalProfile.friends} </span>
            <button className="ProfileAddButton">
              {" "}
              <a href="./community"> + </a>{" "}
            </button>
          </div>
          <p>
            {" "}
            Incoming Friend Requests: {
              personalProfile.incomingFriendRequests
            }{" "}
          </p>
          <p>
            {" "}
            Outgoing Friend Requests: {
              personalProfile.outgoingFriendRequests
            }{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
