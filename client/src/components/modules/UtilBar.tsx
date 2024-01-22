import React from "react";
import "./UtilBar.css";

type Props = {};
const UtilBar = (props: Props) => {
  const makeFiltersDropdown = () => {
    console.log("Clicked Filters Button");
  };
  return (
    <div className="UtilBarContainer">
      <span>
        <button className="UtilBarButton" onClick={makeFiltersDropdown}>
          Filters
        </button>
      </span>
      <span>
        <input className="SearchBar" defaultValue="Search" />
      </span>
      <span>
        <button className="UtilBarButton AddButton">+</button>
      </span>
    </div>
  );
};

export default UtilBar;
