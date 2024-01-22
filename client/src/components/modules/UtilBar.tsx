import React from "react";
import "./UtilBar.css";

type Props = {};
const UtilBar = (props: Props) => {
  const makeFiltersDropdown = () => {
    console.log("Clicked Filters Button");
  };
  return (
    <div className="UtilBarContainer">
      <button
        className="UtilBarButton UtilBarItem"
        onClick={makeFiltersDropdown}
      >
        Filters
      </button>
      <input className="SearchBar UtilBarItem" defaultValue=" Search" />
      <button className="UtilBarButton UtilBarItem AddButton">+</button>
    </div>
  );
};

export default UtilBar;
