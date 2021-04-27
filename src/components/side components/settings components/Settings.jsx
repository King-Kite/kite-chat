import React from "react";
import { connect } from "react-redux";
import { baseUrl, loadingDiv } from "../../../constants";
import Account from "./account components/Account.jsx";
import Appearance from "./appearance components/Appearance.jsx";
import Connection from "./connection components/Connection.jsx";
import History from "./history components/History.jsx";
import Language from "./language components/Language.jsx";
import Logout from "./logout components/Logout.jsx";
import Notification from "./notification components/Notification.jsx";
import Password from "./password components/Password.jsx";
import Privacy from "./privacy components/Privacy.jsx";

const Settings = (props) => {
  const {
    username,
    image_url,
    full_name,
    location,
    contact_count,
    chat_count,
    unread_count,
  } = props.info.user_info !== undefined && props.info.user_info;

  return (
    <div className="tab-pane fade active show" id="settings">
      <div className="settings">
        <div className="profile">
          <img
            className="avatar-xl"
            src={
              image_url !== false && image_url !== undefined
                ? `${baseUrl + image_url}`
                : loadingDiv
            }
            alt="avatar"
          />
          <h1>
            <a href="#">{full_name}</a>
          </h1>
          <span>{location}</span>
          {props.refresh.button}
          <div className="stats">
            <div className="item">
              <h2>{contact_count}</h2>
              <h3>Contacts</h3>
            </div>
            <div className="item">
              <h2>{chat_count}</h2>
              <h3>Chats</h3>
            </div>
            <div className="item">
              <h2>{unread_count}</h2>
              <h3>Unread Msgs</h3>
            </div>
          </div>
        </div>
        <div className="categories" id="accordionSettings">
          <h1>Settings</h1>
          <Account key={1} username={username} />
          <History key={2} username={username} />
          <Password key={3} username={username} />
          <Notification />
          <Connection />
          <Appearance />
          <Language />
          <Privacy />
          <Logout />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    info: state.info.myInfo,
  };
};

export default connect(mapStateToProps)(Settings);
