import React, { useState } from "react";
import useDropDown from "../../../../hooks/useDropDown.jsx";

const Appearance = (props) => {
  const [dark, setDark] = useState(false);
  const dropDown = useDropDown("collapse", "title collapsed");

  const handleChange = (event) => {
    return setDark(!dark);
  };

  return (
    <div className="category">
      <a
        onClick={dropDown.handleClick}
        href="#"
        className={dropDown.aValue}
        id="headingFive"
      >
        <i className="material-icons md-30 online">colorize</i>
        <div className="data">
          <h5>Appearance</h5>
          <p>Customize the look of Swipe</p>
        </div>
        <i className="material-icons">keyboard_arrow_right</i>
      </a>
      <div className={dropDown.divValue} id="collapseFive">
        <div className="content no-layer">
          <div className="set">
            <div className="details">
              <h5>Turn Off Lights</h5>
              <p>
                The dark mode is applied to core areas of the app that are
                normally displayed as light.
              </p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="dark"
                checked={dark}
              />
              <span className="slider round mode"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appearance;
