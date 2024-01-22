import React from "react";

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
  return (
    <div className="FavoriteItemContainer">
      <div className="FavoriteItemLeftCol">
        <div>
          <p>{props.item.picture}</p>
        </div>
        <div>
          <p>{props.item.stars} out of 5 stars</p>
        </div>
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
