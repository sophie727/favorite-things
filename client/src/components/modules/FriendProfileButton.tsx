import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";

import "./FriendProfileButton.css";

type ProfileText = {
  picture: string;
  name: string;
  description: string;
  user_id: string;
};

const defaultProfile: ProfileText = {
  picture: "N/A.",
  name: "FirstName LastName",
  description: "Web.lab is the best, 10/10!",
  user_id: "",
};

type Props = { friend_id: string; is_incoming: boolean };

const FriendProfileButton = (props: Props) => {
  const [friendProfile, setFriendProfile] = useState(defaultProfile);
  useEffect(() => {
    get("/api/profile", { user_id: props.friend_id }).then((profile) => {
      setFriendProfile(profile);
    });
  }, []);

  useEffect(() => {
    socket.on("profileEdit", updateButton);
    return () => {
      socket.off("profileEdit", updateButton);
    };
  }, []);

  const updateButton = (profile: ProfileText) => {
    if (props.friend_id === profile.user_id) {
      setFriendProfile(profile);
    }
  };

  const sendRequest = () => {
    post("/api/friend", { friend_id: props.friend_id });
  };

  const buttonInternals = (
    <>
      <div>
        <img className="ProfilFriendRequestPic" src={friendProfile.picture} />
      </div>
      <div>{friendProfile.name}</div>
    </>
  );

  const acceptFriendButton = (
    <button className="ProfileFriendRequest" onClick={() => sendRequest()}>
      {buttonInternals}
    </button>
  );
  const visitFriendButton = (
    <a href={"/profile?user=" + props.friend_id}>
      <button className="ProfileFriendRequest" onClick={() => sendRequest()}>
        {buttonInternals}
      </button>
    </a>
  );

  return props.is_incoming ? acceptFriendButton : visitFriendButton;
};

export default FriendProfileButton;
