import React, { useState, useEffect } from "react";
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
  private: boolean;
};
type fullItem = {
  item: Item;
  id: string;
};

const Add = (props: Props) => {
  const [newTag, setNewTag] = useState("");

  const [picture, setPicture] = useState("");
  const [starCount, setStarCount] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [chosenTags, setChosenTags] = useState<string[]>([]);
  const [chosenPrivate, setPrivate] = useState(false);
  const [oldId, setOldId] = useState<string | null>();

  const postAddFav = (favItem: Item) => {
    post("/api/addFavorite", { newFav: favItem }).then((newFav) => {
      setPicture("");
      for (const element of document.getElementsByTagName("input")) {
        element.value = "";
      }
      for (const element of document.getElementsByTagName("textarea")) {
        element.value = "";
      }
      setStarCount(0);
      setName("");
      setDescription("");
      setLink("");
      setChosenTags([]);
      setPrivate(false);
      setOldId(null);
      for (const element of document.getElementsByTagName("select")) {
        element.selectedIndex = 0;
      }
    });
  };

  const addFavorite = () => {
    const favItem: Item = {
      picture: picture,
      stars: starCount,
      name: name,
      description: description,
      link: link,
      tags: chosenTags,
      private: chosenPrivate,
    };
    console.log(favItem);

    if (oldId !== null) {
      post("/api/delFav", { id: oldId }).then(() => postAddFav(favItem));
    } else {
      postAddFav(favItem);
    }
  };

  const removeTag = (tag) => {
    setChosenTags(chosenTags.filter((t) => t != tag));
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oldPicture = urlParams.get("picture");
    const oldStars = urlParams.get("stars");
    const oldName = urlParams.get("name");
    const oldDescription = urlParams.get("description");
    const oldLink = urlParams.get("link");
    const oldTags = urlParams.get("tags")?.split(",");
    const oldPrivate = urlParams.get("private") === "true";
    const oldId = urlParams.get("oldId");
    if (oldPicture !== null) {
      setPicture(oldPicture);
    }
    if (oldStars !== null) {
      setStarCount(Number(oldStars));
    }
    if (oldName !== null) {
      setName(oldName);
    }
    if (oldDescription !== null) {
      setDescription(oldDescription);
    }
    if (oldLink !== null) {
      setLink(oldLink);
    }
    if (oldTags !== undefined) {
      setChosenTags(oldTags.filter((tag) => tag != ""));
    }
    setPrivate(oldPrivate);
    setOldId(oldId);
  }, []);

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
            defaultValue={name}
          />
        </span>
      </div>
      <div className="AddContent">
        <span>Description:</span>
        <span>
          <textarea
            className="AddDescription"
            onChange={(event) => setDescription(event.target.value)}
            defaultValue={description}
          />
        </span>
      </div>
      <div className="AddContent">
        <span>Link:</span>
        <span>
          <input
            className="AddInput"
            onChange={(event) => setLink(event.target.value)}
            defaultValue={link}
          />
        </span>
      </div>
      <div className="AddContent">
        <span>Image link:</span>{" "}
        <input
          className="AddInput"
          onChange={(event) => setPicture(event.target.value)}
          defaultValue={picture}
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
      <div className="AddContent u-flex-alignCenter u-rightJustify AddPrivate">
        <span className="AddPrivateElement">Private: </span>
        <label className="switch">
          <input type="hidden" name="AddPrivateInput" value="Public" />
          <input
            type="checkbox"
            name="AddPrivateInput"
            checked={chosenPrivate}
            onChange={() => setPrivate(!chosenPrivate)}
          />
          <div className="slider"></div>
        </label>
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
