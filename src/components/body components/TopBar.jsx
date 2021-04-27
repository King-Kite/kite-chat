import React, { useState } from "react";
import { baseUrl } from "../../constants";
import DropDownData from "./DropDownData.jsx";
import DropDownItem from "./containers/DropDownItem.jsx";

const TopBar = (props) => {
  const { friend, loading, performAction } = props;
  const fUsername = friend !== null && friend.username;

  const status =
    friend !== null && friend.is_friend === true
      ? {
          class_name: " ",
          disabled: false,
        }
      : {
          class_name: " disabled ",
          disabled: true,
        };
  const className =
    friend !== null && friend.logged_in === true
      ? "material-icons online"
      : "material-icons offline";

  const [dropDownClass, setDropDownClass] = useState(
    "dropdown-menu dropdown-menu-right"
  );

  const handleDropDown = () => {
    return dropDownClass === "dropdown-menu dropdown-menu-right"
      ? setDropDownClass("dropdown-menu dropdown-menu-right show")
      : setDropDownClass("dropdown-menu dropdown-menu-right");
  };

  const handleLastLogin = (friend) => {
    if (friend !== null) {
      const date = new Date(friend.last_login);
      const text = "Last Seen On " + date.toDateString();
      return text;
    }
    return "";
  };

  const loadingDiv = (
    <div
      className="loading"
      style={{
        display: "block",
      }}
    />
  );

  const spanText =
    friend !== null && friend.logged_in === true
      ? "Active Now"
      : handleLastLogin(friend);

  const actions = DropDownData.map((data) => (
    <DropDownItem 
      key={data.id} action={performAction} className={data.className}
      text={data.text} params={{command:data.command, friend: fUsername}}
      blocked={friend !== null && friend.blocked} onClick={handleDropDown}
    />
  ))

  return (
    <div className="top">
      <div className="container">
        <div className="col-md-12">
          <div className="inside">
            <a href="#">
              {loading === true || friend === null ? (
                loadingDiv
              ) : (
                <img
                  className="avatar-md"
                  src={`${baseUrl + friend.image_url}`}
                  title={friend.first_name}
                  alt={friend.first_name}
                />
              )}
            </a>
            <div className="status">
              <i className={className}>fiber_manual_record</i>
            </div>
            <div className="data">
              <h5>
                <a href="#">
                  {loading === true || friend === null
                    ? loadingDiv
                    : `${friend.first_name + " " + friend.last_name}`}
                </a>
              </h5>
              <span>{loading === true ? "" : spanText}</span>
            </div>
            <button className="btn d-md-block d-none">
              <i className="material-icons md-30">info</i>
            </button>
            <div className="dropdown">
              <button
                onClick={handleDropDown}
                className={"btn" + status.class_name}
                disabled={status.disabled}
              >
                <i className="material-icons md-30">more_vert</i>
              </button>
              <div className={dropDownClass + " dropStyle "}>
                { actions }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
