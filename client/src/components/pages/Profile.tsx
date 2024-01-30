import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import { socket } from "../../client-socket";
import FriendProfileButton from "../modules/FriendProfileButton";

import "./Profile.css";

type ProfileType = {
  picture: string;
  name: string;
  description: string;
  friends: string[];
  incomingFriendRequests: string[];
  outgoingFriendRequests: string[];
  user_id: string;
};
type ProfileText = {
  picture: string;
  name: string;
  description: string;
  user_id: string;
};
type FriendRequest = {
  first_id: string;
  second_id: string;
  accepted: boolean;
};

type Props = {
  userId: string;
  currID: string;
  setCurrID: React.Dispatch<React.SetStateAction<string>>;
};

const defaultProfile: ProfileType = {
  picture: "N/A.",
  name: "FirstName LastName",
  description: "Web.lab is the best, 10/10!",
  friends: [],
  incomingFriendRequests: [],
  outgoingFriendRequests: [],
  user_id: "",
};

const Profile = (props: Props) => {
  const [profile, setProfile] = useState(defaultProfile);
  const [isFriend, setIsFriend] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    socket.on("profileEdit", changeProfileText);
    return () => {
      socket.off("profileEdit", changeProfileText);
    };
  }, []);

  useEffect(() => {
    get("/api/profile", { user_id: props.currID }).then((myProfile) => {
      props.setCurrID((id) => {
        console.log("got profile for " + myProfile.user_id);
        console.log(myProfile);
        if (myProfile.user_id === id) {
          console.log("setting profile!", myProfile.user_id, id);
          setProfile(myProfile);
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
      get("/api/isPending", { friend_id: props.currID }).then((pairs) => {
        props.setCurrID((id) => {
          if (props.currID === id) {
            setIsPending(pairs.length > 0);
          }
          return id;
        });
      });
    }
  }, [props.currID]);

  useEffect(() => {
    socket.on("newFriends", processNewFriends);
    return () => {
      socket.off("newFriends", processNewFriends);
    };
  });

  useEffect(() => {
    socket.on("delFriends", processDelFriends);
    return () => {
      socket.off("delFriends", processDelFriends);
    };
  });

  const processNewFriends = (newFriendsPair: FriendRequest) => {
    if (newFriendsPair.first_id === props.userId || newFriendsPair.second_id === props.userId) {
      props.setCurrID((id) => {
        if (props.userId === id) {
          // Looking at your page when friendship is made!
          const other_id =
            newFriendsPair.first_id === props.userId
              ? newFriendsPair.second_id
              : newFriendsPair.first_id;
          setProfile((currProfile) => {
            const newProfile: ProfileType = { ...currProfile };
            newProfile.friends = newProfile.friends.filter((friend) => friend != other_id);
            newProfile.incomingFriendRequests = newProfile.incomingFriendRequests.filter(
              (friend) => friend != other_id
            );
            newProfile.outgoingFriendRequests = newProfile.outgoingFriendRequests.filter(
              (friend) => friend != other_id
            );
            if (newFriendsPair.accepted) {
              newProfile.friends = newProfile.friends.concat([other_id]);
            } else if (newFriendsPair.first_id === props.userId) {
              newProfile.outgoingFriendRequests = newProfile.outgoingFriendRequests.concat([
                other_id,
              ]);
            } else {
              newProfile.incomingFriendRequests = newProfile.incomingFriendRequests.concat([
                other_id,
              ]);
            }

            return newProfile;
          });
        } else if (newFriendsPair.first_id === id || newFriendsPair.second_id === id) {
          if (newFriendsPair.accepted) {
            setIsFriend(true);
            setIsPending(false);
          } else if (newFriendsPair.first_id === props.userId) {
            setIsPending(true);
          }
        }
        return id;
      });
    }
  };

  const processDelFriends = (first_id: string, second_id: string) => {
    props.setCurrID((id) => {
      if (first_id === props.userId || second_id === props.userId) {
        // Use this janky code to actually access the correct currID
        if (props.userId === id) {
          // Looking at your page while you stop being friends
          const other_id = first_id === props.userId ? second_id : first_id;
          setProfile((currProfile) => {
            const newProfile: ProfileType = { ...currProfile };
            newProfile.friends = newProfile.friends.filter((friend) => friend != other_id);
            newProfile.incomingFriendRequests = newProfile.incomingFriendRequests.filter(
              (friend) => friend != other_id
            );
            newProfile.outgoingFriendRequests = newProfile.outgoingFriendRequests.filter(
              (friend) => friend != other_id
            );
            return newProfile;
          });
        } else if (first_id === id || second_id === id) {
          // Looking at the other guy's page when you stop being friends and stuff
          setIsFriend(false);
          setIsPending(false);
        }
      }
      return id;
    });
  };

  const changeProfileText = (profileText: ProfileText) => {
    props.setCurrID((id) => {
      console.log(id, "currID");
      if (id == profileText.user_id) {
        setProfile((oldProfile) => {
          const newProfile = { ...oldProfile };
          newProfile.picture = profileText.picture;
          newProfile.name = profileText.name;
          newProfile.description = profileText.description;
          return newProfile;
        });
      }
      return id;
    });
  };

  const sendFriendRequest = () => {
    post("/api/friend", { friend_id: props.currID });
  };

  const removeFriend = () => {
    post("/api/unfriend", { friend_id: props.currID });
  };

  return (
    <div className="Profile">
      <div className="ProfileLeftColumn">
        <img className="ProfilePicture" src={profile.picture} />
        <div className="u-flex-alignCenter">
          {props.userId === props.currID || isFriend ? (
            <button className="ProfileGoToFavorites">
              {" "}
              <a href={"/?user=" + props.currID}> Go to Favorites </a>
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="ProfileRightColumn">
        <div className="u-flex-alignCenter">
          {" "}
          <h1> Profile</h1>
          {props.currID === props.userId ? (
            <a href="/profile/edit" className="ProfileEditButton">
              Edit
            </a>
          ) : isFriend ? (
            <a className="ProfileAddFriendButton" onClick={removeFriend}>
              {" "}
              Remove Friend{" "}
            </a>
          ) : isPending ? (
            <a className="ProfileAddFriendButton" onClick={removeFriend}>
              {" "}
              Withdraw Friend Request{" "}
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
          {props.currID === props.userId ? (
            <>
              <div>
                {" "}
                Friends:{" "}
                <a href="/community">
                  {" "}
                  <button className="AddButton">+</button>
                </a>
                <div className="FriendRequests">
                  {profile.friends.map((friend: string) => (
                    <FriendProfileButton friend_id={friend} is_incoming={false} />
                  ))}{" "}
                </div>
              </div>
              <p>
                {" "}
                Incoming Friend Requests:{" "}
                <div className="FriendRequests">
                  {" "}
                  {profile.incomingFriendRequests.map((friend: string) => (
                    <FriendProfileButton friend_id={friend} is_incoming={true} />
                  ))}
                </div>
              </p>
              <p>
                {" "}
                Outgoing Friend Requests:
                <div className="FriendRequests">
                  {" "}
                  {profile.outgoingFriendRequests.map((friend: string) => (
                    <FriendProfileButton friend_id={friend} is_incoming={false} />
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
