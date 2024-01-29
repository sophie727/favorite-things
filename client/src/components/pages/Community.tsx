import React, { useState, useEffect } from "react";

import "./Community.css";
import ProfileBox from "../modules/ProfileBox";

type Item = {
  picture: string;
  name: string;
  description: string;
};

type Props = {};

const Community = () => {
  const defaultItem = {
    picture:
      "https://i.pinimg.com/736x/05/d3/a5/05d3a51c5fa2940a2f0710957f1dbd0d.jpg",
    name: "FirstName LastName",
    description: "Web.lab is the best, 10/10!",
  };

  return (
    <div>
      <h1 className="CommunityTitle"> Community </h1>
      <div className="CommunitySearchBarContainer">
        {" "}
        <input className="SearchBar" placeholder=" Search" />
      </div>
      <div className="HomeFavoriteItemContainer">
        <ProfileBox item={defaultItem}></ProfileBox>
      </div>
    </div>
  );
};

export default Community;
