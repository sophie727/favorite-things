import React, { ReactComponentElement } from "react";

import "./FavoriteItem.css";

type Item = {
  picture: string;
  stars: number;
  name: string;
  description: string;
  links: string[];
  tags: string[];
};

type Props = { item: Item };
const FavoriteItem = (props: Props) => {
  const stars: React.JSX.Element[] = [];
  for (let i = 0; i < 5; i++) {
    if (i < props.item.stars) {
      stars.push(<span>&#9733;</span>);
    } else {
      stars.push(<span>&#9734;</span>);
    }
  }
  return (
    <div className="FavoriteItemContainer">
      <div className="FavoriteItemLeftCol">
        <div>
          <p>{props.item.picture}</p>
        </div>
        <div id="FavoriteItemStars">{stars}</div>
      </div>

      <div className="FavoriteItemRightCol">
        <div>
          <h1>{props.item.name}</h1>
          <p>{props.item.description}</p>
        </div>
        <div>
          {props.item.links.map((link: string, index) => {
            return (
              <a href={link} key={index}>
                {link}
              </a>
            );
          })}
        </div>
        <div>
          {props.item.tags.map((tag: string, index) => {
            return (
              <button className="Tag" key={index}>
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FavoriteItem;
