import React from "react";

import "./DailyFavorite.css";
import FavoriteItem from "./FavoriteItem";

type fullItem = {
  picture: string;
  stars: number;
  name: string;
  description: string;
  link: string;
  tags: string[];
  private: boolean;
  id: string;
};

type Props = { item: fullItem };
const DailyFavorite = (props: Props) => {
  return (
    <div className="DailyFavorite">
      <FavoriteItem item={props.item} />
    </div>
  );
};

export default DailyFavorite;
