import React, { useState } from "react";
import useDropDown from "../../../../hooks/useDropDown.jsx";

const Notification = (props) => {
  const [desktop, setDesktop] = useState(true);
  const [unread, setUnread] = useState(false);
  const [taskbar, setTaskbar] = useState(true);
  const [sound, setSound] = useState(true);
  const dropDown = useDropDown("collapse", "title collapsed");

  const handleChange = (event) => {
    const name = event.target.name;
    return name === "desktop"
      ? setDesktop(!desktop)
      : name === "unread"
      ? setUnread(!unread)
      : name === "taskbar"
      ? setTaskbar(!taskbar)
      : setSound(!sound);
  };

  return (
    <div className="category">
      <a
        onClick={dropDown.handleClick}
        href="#"
        className={dropDown.aValue}
        id="headingThree"
      >
        <i className="material-icons md-30 online">notifications_none</i>
        <div className="data">
          <h5>Notifications</h5>
          <p>Turn notifications on or off</p>
        </div>
        <i className="material-icons">keyboard_arrow_right</i>
      </a>
      <div className={dropDown.divValue} id="collapseThree">
        <div className="content no-layer">
          <div className="set">
            <div className="details">
              <h5>Desktop Notifications</h5>
              <p>
                You can set up Swipe to receive notifications when you have new
                messages.
              </p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="desktop"
                checked={desktop}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="set">
            <div className="details">
              <h5>Unread Message Badge</h5>
              <p>
                If enabled shows a red badge on the Swipe app icon when you have
                unread messages.
              </p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="unread"
                checked={unread}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="set">
            <div className="details">
              <h5>Taskbar Flashing</h5>
              <p>
                Flashes the Swipe app on mobile in your taskbar when you have
                new notifications.
              </p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="taskbar"
                checked={taskbar}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="set">
            <div className="details">
              <h5>Notification Sound</h5>
              <p>
                Set the app to alert you via notification sound when you have
                unread messages.
              </p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="sound"
                checked={sound}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
