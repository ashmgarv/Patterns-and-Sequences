import React from "react";
const SelectMenu = props => {
  return (
    <React.Fragment>
      {props.selectmenus.map(menu => (
        <React.Fragment>
          <label className="selectMenuLbl">
            {menu.menuName === "Funnel" ? "" : menu.menuName}
          </label>
          <select
            style={{ fontSize: 10, height: 25 }}
            className="custom-select custom-select-sm col-sm-1 m-3"
          >
            <option selected>Select</option>
            {menu.items.map(item => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default SelectMenu;
