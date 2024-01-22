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
    <>
      <span className="FavoriteItemContainer FavoriteItemLeftCol">
        <div>
          <p>{props.item.picture}</p>
        </div>
        <div>
          <p>{props.item.stars} out of 5 stars</p>
        </div>
      </span>

      <span className="FavoriteItemContainer FavoriteItemRightCol">
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
      </span>
    </>
  );
};

export default FavoriteItem;
