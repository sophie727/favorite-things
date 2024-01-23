import React, { useState } from "react";

import "./Add.css";

type Props = {};
const Add = (props: Props) => {
  const [tagOptions, setTagOptions] = useState([
    "",
    "cute things",
    "animals",
    "science",
  ]);
  const [chosenTags, setChosenTags] = useState<string[]>([]);
  const pressStar = () => {};
  return (
    <>
      <div>
        <h1 className="AddContent">Add a favorite</h1>
      </div>
      <div className="AddContent">
        <span>Item:</span>
        <span>
          <input className="AddItemName" />
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
          <button className="AddStarButton" onClick={pressStar}>
            &#9734;
          </button>
          <button className="AddStarButton" onClick={pressStar}>
            &#9734;
          </button>
          <button className="AddStarButton" onClick={pressStar}>
            &#9734;
          </button>
          <button className="AddStarButton" onClick={pressStar}>
            &#9734;
          </button>
          <button className="AddStarButton" onClick={pressStar}>
            &#9734;
          </button>
        </span>
      </div>
      <div className="AddContent">
        <span>Description:</span>
        <span>
          <textarea className="AddDescription" />
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
        <button className="AddButton" onClick={() => {}}>
          Add
        </button>
      </div>
    </>
  );
};

export default Add;
