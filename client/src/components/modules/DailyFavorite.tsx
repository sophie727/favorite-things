import React from "react";

import "./DailyFavorite.css";
import FavoriteItem from "./FavoriteItem";

type Item = {
  picture: string;
  stars: number;
  name: string;
  description: string;
  link: string;
  tags: string[];
};

type Props = { item: Item };
const DailyFavorite = (props: Props) => {
  return (
    <div className="DailyFavorite">
      <FavoriteItem item={props.item} />
    </div>
  );
};

export default DailyFavorite;
