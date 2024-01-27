import React from "react";
import "./UtilBar.css";

type Props = {
  tagOptions: string[];
  filterTags: string[];
  setFilterTags: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};
const UtilBar = (props: Props) => {
  const makeFiltersDropdown = () => {
    var popup = document.getElementById("FilterPopup");
    popup?.classList.toggle("show");
  };
  const addTagFilter = (newTag: string) => {
    for (const tag of props.filterTags) {
      if (tag === newTag) {
        return;
      }
    }
    props.setFilterTags(props.filterTags.concat([newTag]));
  };
  const removeTag = (tag: string) => {
    const index = props.filterTags.indexOf(tag);
    if (index > -1) {
      const newTags = [...props.filterTags];
      newTags.splice(index, 1);
      props.setFilterTags(newTags);
    }
  };
  return (
    <>
      <div className="UtilBarContainer">
        <button className="UtilBarItem UtilBarButton UtilBarFilter" onClick={makeFiltersDropdown}>
          Filters
          <div className="UtilBarPopupTextContainer">
            <div className="UtilBarPopupText" id="FilterPopup">
              <h2>Filter your favorites! </h2>
              <p>Click the tag you wish to filter by:</p>
              {props.tagOptions.map((tag: string) => {
                if (tag === "") {
                  return;
                }
                return (
                  <button onClick={() => addTagFilter(tag)} className="tagButton">
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </button>
        <input
          className="UtilBarItem SearchBar"
          placeholder=" Search"
          onChange={(event) => {
            props.setSearchText(event.target.value);
          }}
        />
        <a href="/add/">
          <button className="UtilBarItem UtilBarButton AddButton">+</button>
        </a>
      </div>
      <div className="TagButtons">
        {props.filterTags.map((tag) => (
          <button className="AddedTag" onClick={() => removeTag(tag)}>
            {tag}
          </button>
        ))}
      </div>
    </>
  );
};

export default UtilBar;
