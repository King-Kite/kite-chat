import React, { useState } from "react";
import useDropDown from "../../../../hooks/useDropDown.jsx";

const Privacy = (props) => {
  const [safe, setSafe] = useState(false);
  const [nice, setNice] = useState(true);
  const [everyone, setEveryone] = useState(true);
  const [friends, setFriends] = useState(true);
  const [improve, setImprove] = useState(false);
  const [customize, setCustomize] = useState(false);
  const dropDown = useDropDown("collapse", "title collapsed");

  const handleChange = (event) => {
    const name = event.target.name;
    return name === "safe"
      ? setSafe(!safe)
      : name === "nice"
      ? setNice(!nice)
      : name === "everyone"
      ? setEveryone(!everyone)
      : name === "friends"
      ? setFriends(!friends)
      : name === "improve"
      ? setImprove(!improve)
      : setCustomize(!customize);
  };

  return (
    <div className="category">
      <a
        onClick={dropDown.handleClick}
        href="#"
        className={dropDown.aValue}
        id="headingSeven"
      >
        <i className="material-icons md-30 online">lock_outline</i>
        <div className="data">
          <h5>Privacy & Safety</h5>
          <p>Control your privacy settings</p>
        </div>
        <i className="material-icons">keyboard_arrow_right</i>
      </a>
      <div className={dropDown.divValue} id="collapseSeven">
        <div className="content no-layer">
          <div className="set">
            <div className="details">
              <h5>Keep Me Safe</h5>
              <p>
                Automatically scan and delete direct messages you receive from
                everyone that contain explict content.
              </p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="safe"
                checked={safe}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="set">
            <div className="details">
              <h5>My Friends Are Nice</h5>
              <p>
                If enabled scans direct messages from everyone unless they are
                listed as your friend.
              </p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="nice"
                checked={nice}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="set">
            <div className="details">
              <h5>Everyone can add me</h5>
              <p>
                If enabled anyone in or out your friends of friends list can
                send you a friend request.
              </p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="everyone"
                checked={everyone}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="set">
            <div className="details">
              <h5>Friends of Friends</h5>
              <p>
                Only your friends or your mutual friends will be able to send
                you a friend reuqest.
              </p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="friends"
                checked={friends}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="set">
            <div className="details">
              <h5>Data to Improve</h5>
              <p>
                This settings allows us to use and process information for
                analytical purposes.
              </p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="improve"
                checked={improve}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="set">
            <div className="details">
              <h5>Data to Customize</h5>
              <p>
                This settings allows us to use your information to customize
                Swipe for you.
              </p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="customize"
                checked={customize}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
