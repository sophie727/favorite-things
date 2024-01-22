import React, { useState } from "react";

import "./Add.css";

type Props = {};
const Add = (props: Props) => {
  const [tagOptions, setTagOptions] = useState(["", "cute things", "animals", "science"]);
  const [chosenTags, setChosenTags] = useState<string[]>([]);
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
        <span>
          Star Star Star Star Star Note: Make these buttons that are shaped like stars somehow
        </span>
      </div>
      <div className="AddContent">
        <span>Description:</span>
        <span>
          <input className="AddDescription" />
        </span>
      </div>
      <div className="AddContent">
        <span>Image:</span> <span> Not quite sure what the input for this should look like.</span>
      </div>
      <div className="AddContent">
        <span>Links:</span>
        <span>
          <input className="AddItemName" />
        </span>
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
