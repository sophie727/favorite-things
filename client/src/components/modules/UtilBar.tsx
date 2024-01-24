import React from "react";
import "./UtilBar.css";

type Props = {};
const UtilBar = (props: Props) => {
  const makeFiltersDropdown = () => {
    var popup = document.getElementById("FilterPopup");
    popup?.classList.toggle("show");
  };
  const tagFilter = () => {
    console.log("Clicked cute");
  };
  return (
    <div className="UtilBarContainer">
      <button
        className="UtilBarButton UtilBarItem UtilBarFilter"
        onClick={makeFiltersDropdown}
      >
        Filters
        <div className="UtilBarPopupTextContainer">
          <div className="UtilBarPopupText" id="FilterPopup">
            <h2>Filter your favorites! </h2>
            <p>Press the tag you wish to filter by:</p>
            <button onClick={tagFilter} className="button">
              {" "}
              cute things
            </button>
          </div>
        </div>
      </button>
      <input className="SearchBar UtilBarItem" placeholder="Search" />
      <a href="/add/">
        <button className="AddButton UtilBarButton UtilBarItem">+</button>
      </a>
    </div>
  );
};

export default UtilBar;
