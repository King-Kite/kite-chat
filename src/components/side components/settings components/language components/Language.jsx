import React, { useState } from "react";
import useDropDown from "../../../../hooks/useDropDown.jsx";

const Language = (props) => {
  const [language, setLanguage] = useState(false);
  const dropDown = useDropDown("collapse", "title collapsed");

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="category">
      <a
        onClick={dropDown.handleClick}
        href="#"
        className={dropDown.aValue}
        id="headingSix"
      >
        <i className="material-icons md-30 online">language</i>
        <div className="data">
          <h5>Language</h5>
          <p>Select preferred language</p>
        </div>
        <i className="material-icons">keyboard_arrow_right</i>
      </a>
      <div className={dropDown.divValue} id="collapseSix">
        <div className="content layer">
          <div className="language">
            <label>Language</label>
            <select
              onChange={handleChange}
              className="custom-select"
              id="country"
              required={true}
            >
              <option value="">Select an language...</option>
              <option>English, UK</option>
              <option>English, US</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Language;
