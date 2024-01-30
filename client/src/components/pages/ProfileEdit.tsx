import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";

import "./ProfileEdit.css";

type ProfileType = {
  picture: string;
  name: string;
  description: string;
  friends: string[];
  incomingFriendRequests: string[];
  outgoingFriendRequests: string[];
};

const defaultProfile: ProfileType = {
  picture: "",
  name: "",
  description: "",
  friends: [],
  incomingFriendRequests: [],
  outgoingFriendRequests: [],
};
type ProfileText = {
  picture: string;
  name: string;
  description: string;
};

type Props = { userId: string };

const ProfileEdit = (props: Props) => {
  const [profile, setProfile] = useState(defaultProfile);
  const [name, setName] = useState("");
  const [picture, setPicture] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    get("/api/profile", { user_id: props.userId }).then((newProfile) => {
      console.log(newProfile);
      setProfile(newProfile);
    });
  }, []);

  useEffect(() => {
    setName(profile.name);
    setPicture(profile.picture);
    setDescription(profile.description);
  }, [profile]);

  const changeProfile = () => {
    const newProfileText: ProfileText = {
      picture: picture,
      name: name,
      description: description,
    };
    console.log(newProfileText);
    post("/api/profile", { newProfileText: newProfileText });
  };

  return (
    <div className="ProfileEdit">
      <h1 className="u-textCenter">Edit Profile</h1>
      <div className="ProfileEditContent">
        <span>Name:</span>
        <span>
          <input
            className="AddInput"
            defaultValue={name}
            onChange={(event) => setName(event.target.value)}
          />
        </span>
      </div>
      <div className="ProfileEditContent">
        <span>Profile Image link:</span>
        <span>
          <input
            className="AddInput"
            defaultValue={picture}
            onChange={(event) => setPicture(event.target.value)}
          />
        </span>
      </div>
      <div className="ProfileEditContent">
        <span>Description:</span>
        <span>
          <textarea
            className="AddDescription"
            defaultValue={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </span>
      </div>
      <div className="AddContent AddButtonContainer">
        {/*<a href="/profile">*/}
        <button className="AddButton UpdateButton" onClick={changeProfile}>
          Update
        </button>
        {/*</a>*/}
      </div>
    </div>
  );
};

export default ProfileEdit;
