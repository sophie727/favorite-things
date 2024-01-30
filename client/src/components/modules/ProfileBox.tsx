import React, { ReactComponentElement } from "react";

import "./ProfileBox.css";

type Item = {
  picture: string;
  name: string;
  description: string;
  user_id: string;
};

type Props = { item: Item };
const ProfileBox = (props: Props) => {
  return (
    <a href={"/profile?user=" + props.item.user_id} className="ProfileBox">
      <div className="ProfileBoxContainer">
        <div className="ProfileBoxLeftCol">
          <img className="ProfileBoxPic" src={props.item.picture} />
        </div>
        <div className="ProfileBoxRightCol">
          <div>
            <h1>{props.item.name}</h1>
            <p> {props.item.description}</p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ProfileBox;
