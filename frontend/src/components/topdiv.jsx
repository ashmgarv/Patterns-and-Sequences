import React from "react";
import SearchBar from "./searchbar";
import SelectMenu from "./selectmenu";
import CheckBox from "./checkbox";
const TopDiv = props => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <SelectMenu
        selectmenus={props.selectmenus}
        datasetChanged={props.datasetChanged}
      />
      <CheckBox CheckBoxName={props.CheckBoxName} />
      {props.pats.length !== 0 ? (
        <SearchBar
          BarName={props.BarName}
          eventMaps={props.eventMap}
          startSearch={props.startSearch}
          pats={props.pats}
        />
      ) : (
        <p />
      )}
    </nav>
  );
};

export default TopDiv;
