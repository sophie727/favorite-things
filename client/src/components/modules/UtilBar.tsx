import React from "react";
import "./UtilBar.css";

type Props = {};
const UtilBar = (props: Props) => {
  const makeFiltersDropdown = () => {
    var popup = document.getElementById("FilterPopup");
    popup?.classList.toggle("show");
    console.log("Clicked Filters Button");
  };
  return (
    <div className="UtilBarContainer">
      <button
        className="UtilBarButton UtilBarItem UtilBarFilter"
        onClick={makeFiltersDropdown}
      >
        Filters
        <span className="UtilBarPopupText" id="FilterPopup">
          Filter your favorites!
        </span>
      </button>
      <input className="SearchBar UtilBarItem" placeholder="Search" />
      <a href="http://localhost:5050/add">
        <button className="AddButton UtilBarButton UtilBarItem">+</button>
      </a>
    </div>
  );
};

export default UtilBar;
