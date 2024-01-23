import React, { useState } from "react";
import { post } from "../../utilities";

import "./Add.css";

type Props = {};

type Item = {
  picture: string;
  stars: number;
  name: string;
  description: string;
  links: string[];
  tags: string[];
};

const Add = (props: Props) => {
  const [tagOptions, setTagOptions] = useState(["", "cute things", "animals", "science"]);
  const [chosenTags, setChosenTags] = useState<string[]>([]);

  const [picture, setPicture] = useState("");
  const [starCount, setStarCount] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<string[]>([]);

  const pressStar = () => {};

  const addFavorite = () => {
    const favItem: Item = {
      picture: picture,
      stars: starCount,
      name: name,
      description: description,
      links: links,
      tags: chosenTags,
    };
    post("/api/addFavorite", { newFav: favItem }).then((newFav) => {
      //TODO: ADD TO FAVORITE LIST!
    });
    // TODO: Clear the form.
  };

  return (
    <>
      <div>
        <h1 className="AddContent">Add a favorite</h1>
      </div>
      <div className="AddContent">
        <span>Item:</span>
        <span>
          <input className="AddItemName" onChange={(event) => setName(event.target.value)} />
        </span>
      </div>
      <div className="AddContent">
        <span>Tags:</span>
        <span>
          {chosenTags.map((tag) => (
            <button className="AddedTag">{tag}</button>
          ))}
          <select
            className="AddTags"
            onChange={(thisObject) => {
              setChosenTags(chosenTags.concat([thisObject.target.value]));
            }}
          >
            {tagOptions.map((tag) => (
              <option>{tag}</option>
            ))}
          </select>
        </span>
      </div>
      <div className="AddContent">
        <span>Stars:</span>
        <span className="AddStars">
          {[...Array(5).keys()].map((index) => (
            <button
              className="AddStarButton"
              onClick={() => {
                setStarCount(index + 1);
              }}
            >
              {starCount > index ? <>&#9733;</> : <>&#9734;</>}
            </button>
          ))}
        </span>
      </div>
      <div className="AddContent">
        <span>Description:</span>
        <span>
          <textarea
            className="AddDescription"
            onChange={(event) => setDescription(event.target.value)}
          />
        </span>
      </div>
      <div className="AddContent">
        <span>Links:</span>
        <span>
          <input className="AddItemName" />
        </span>
      </div>
      <div className="AddContent">
        <span>Image:</span> <input type="file" accept="image/png, image/jpeg" />
      </div>
      <div className="AddContent">
        <button className="AddButton" onClick={addFavorite}>
          Add
        </button>
      </div>
    </>
  );
};

export default Add;
