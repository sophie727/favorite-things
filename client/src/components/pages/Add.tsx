import React, { useState } from "react";
import { post } from "../../utilities";

import "./Add.css";

type Props = {
  tagOptions: string[];
  setTagOptions: React.Dispatch<React.SetStateAction<string[]>>;
};

type Item = {
  picture: string;
  stars: number;
  name: string;
  description: string;
  link: string;
  tags: string[];
};

const Add = (props: Props) => {
  const [newTag, setNewTag] = useState("");

  const [picture, setPicture] = useState("");
  const [starCount, setStarCount] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [chosenTags, setChosenTags] = useState<string[]>([]);

  const addFavorite = () => {
    const favItem: Item = {
      picture: picture,
      stars: starCount,
      name: name,
      description: description,
      link: link,
      tags: chosenTags,
    };
    console.log(favItem);
    post("/api/addFavorite", { newFav: favItem }).then((newFav) => {
      //TODO: ADD TO FAVORITE LIST! Needs to use sockets and stuff, save for after MVP because lazy.
      for (const element of document.getElementsByTagName("input")) {
        element.value = "";
      }
      for (const element of document.getElementsByTagName("textarea")) {
        element.value = "";
      }
      setStarCount(0);
      setChosenTags([]);
      for (const element of document.getElementsByTagName("select")) {
        element.selectedIndex = 0;
      }
    });
  };

  const removeTag = (tag) => {
    const index = chosenTags.indexOf(tag);
    if (index > -1) {
      const newTags = [...chosenTags];
      newTags.splice(index, 1);
      setChosenTags(newTags);
    }
  };

  const addNewTag = () => {
    addChosenTag(newTag);
    for (const tag of props.tagOptions) {
      if (tag === newTag) {
        return;
      }
    }

    post("/api/addTag", { newTag: newTag }).then(() => {
      props.setTagOptions(props.tagOptions.concat([newTag]));

      const newTagInput = document.getElementById("newTagInput");
      if (newTagInput instanceof HTMLInputElement) {
        newTagInput.value = "";
      }
    });
  };

  const addChosenTag = (newTag: string) => {
    for (const tag of chosenTags) {
      if (tag == newTag) {
        return;
      }
    }
    if (newTag == "") {
      return;
    }
    setChosenTags(chosenTags.concat([newTag]));
  };

  return (
    <>
      <div>
        <h1 className="AddContent AddTitle">Add a favorite</h1>
      </div>
      <div className="AddContent">
        <span>Item:</span>
        <span>
          <input
            className="AddInput"
            onChange={(event) => setName(event.target.value)}
          />
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
        <span>Link:</span>
        <span>
          <input
            className="AddInput"
            onChange={(event) => setLink(event.target.value)}
          />
        </span>
      </div>
      <div className="AddContent">
        <span>Image link:</span>{" "}
        <input
          className="AddInput"
          onChange={(event) => setPicture(event.target.value)}
        />
      </div>
      <div className="AddContent">
        <span>Tags:</span>
        <span>
          {chosenTags.map((tag) => (
            <button className="AddedTag" onClick={() => removeTag(tag)}>
              {tag}
            </button>
          ))}
          <select
            className="AddTags"
            onChange={(event) => {
              addChosenTag(event.target.value);
            }}
          >
            {props.tagOptions.map((tag) => (
              <option>{tag}</option>
            ))}
          </select>
        </span>
        <span>New Tag:</span>
        <span>
          <input
            className="AddInput"
            id="newTagInput"
            onChange={(event) => {
              setNewTag(event.target.value);
            }}
          />
        </span>
        <span>
          <button
            className="AddButton"
            onClick={() => {
              addNewTag();
            }}
          >
            +
          </button>
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
      <div className="AddContent AddButtonContainer">
        <button className="AddButton LargeAddButton" onClick={addFavorite}>
          Add
        </button>
      </div>
    </>
  );
};

export default Add;
