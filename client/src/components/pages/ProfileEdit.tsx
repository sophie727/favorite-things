import React, { useState, useEffect } from "react";

import "./ProfileEdit.css";

type Props = {};

type Item = {
  picture: string;
  name: string;
  description: string;
  friends: string[];
  friendRequests: string[];
};

const ProfileEdit = (props: Props) => {
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
    <div className="ProfileEdit">
      <h1 className="u-textCenter">New Profile</h1>
      <div className="ProfileEditContent">
        <span>Name:</span>
        <span>
          <input className="AddInput" />
        </span>
      </div>
      <div className="ProfileEditContent">
        <span>Profile Image link:</span>
        <span>
          <input className="AddInput" />
        </span>
      </div>
      <div className="ProfileEditContent">
        <span>Description:</span>
        <span>
          <textarea className="AddDescription" />
        </span>
      </div>
      <div className="AddContent AddButtonContainer">
        <button className="AddButton LargeAddButton">Add</button>
      </div>
    </div>
  );
};

export default ProfileEdit;
