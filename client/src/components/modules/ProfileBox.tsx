import React, { ReactComponentElement } from "react";

import "./ProfileBox.css";

type Item = {
  picture: string;
  name: string;
  description: string;
};

type Props = { item: Item };
const ProfileBox = (props: Props) => {
  return (
    <div className="ProfileBoxContainer">
      <div className="ProfileBoxLeftCol">
        <img className="ProfileBoxPic" src={props.item.picture} />
      </div>
      <div className="profileBoxRightCol">
        <div>
          <h1>{props.item.name}</h1>
          <p>{props.item.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
