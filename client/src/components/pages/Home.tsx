import React, { useState, useEffect } from "react";

import "./Home.css";
import DailyFavorite from "../modules/DailyFavorite";
import UtilBar from "../modules/UtilBar";

type Props = {};
const Home = (props: Props) => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  return (
    <>
      <DailyFavorite />
      <UtilBar />
      {JSON.stringify(favoriteItems)}
    </>
  );
};

export default Home;
