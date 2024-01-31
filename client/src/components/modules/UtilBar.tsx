import React from "react";
import "./UtilBar.css";

type Props = {
  tagOptions: string[];
  filterTags: string[];
  setFilterTags: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  canAdd: boolean;
  isSorted: boolean;
  setIsSorted: React.Dispatch<React.SetStateAction<boolean>>;
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
    props.setFilterTags(props.filterTags.filter((t) => t != tag));
  };
  return (
    <>
      <div className="UtilBarContainer">
        <div>
          <button className="UtilBarFilter">
            <div className="buttonDarken">
              <div className="UtilBarFilterText" onClick={makeFiltersDropdown}>
                Filters
              </div>
            </div>
            <div className="UtilBarPopupTextContainer">
              <div className="UtilBarPopupText" id="FilterPopup">
                <div className="u-flex">
                  <h2 className="popupTitle">Filter your favorites! </h2>
                  <p className="xButton" onClick={makeFiltersDropdown}>
                    x
                  </p>
                </div>
                <p>Click the tag you wish to filter by:</p>
                {props.tagOptions.map((tag: string) => {
                  if (tag === "") {
                    return;
                  }
                  return (
                    <span className="blueButtonDarken tagButtons">
                      <button
                        onClick={() => addTagFilter(tag)}
                        className="tagButton"
                      >
                        {tag}
                      </button>
                    </span>
                  );
                })}
                <hr />
                <div>
                  {" "}
                  <p>Sort by: </p>
                  <input
                    className="sortCheckbox"
                    type="checkbox"
                    checked={props.isSorted}
                    onClick={() => props.setIsSorted(!props.isSorted)}
                  />
                  Star count
                </div>{" "}
              </div>
            </div>
          </button>
        </div>
        <input
          className="UtilBarItem SearchBar"
          placeholder=" Search"
          onChange={(event) => {
            props.setSearchText(event.target.value);
          }}
        />
        {props.canAdd ? (
          <a className="buttonDarken" href="/add/">
            <button className="UtilBarItem UtilBarButton AddButton">+</button>
          </a>
        ) : (
          <></>
        )}
      </div>
      <div className="TagButtons">
        {props.filterTags.map((tag) => (
          <div className="AddedTagContainer blueButtonDarken">
            <button className="AddedTag" onClick={() => removeTag(tag)}>
              {tag}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default UtilBar;
