import React from "react";
import { baseUrl } from "../../../constants";

const Request = (props) => {
  const { friend, username } = props;

  const { sender, recipient, message } =
    friend !== undefined &&
    friend.frnd_request !== undefined &&
    friend.frnd_request !== false &&
    friend.frnd_request;

  const frndMessage =
    sender === username
      ? `You sent ${recipient} a Friend Request!`
      : `${sender} sent you a Friend Request`;

  const showButton = sender === username ? false : true;

  const data = {
    chat_name: props.chatName,
    username: sender,
    friend: recipient,
    who_acted: username,
  };

  return (
    <div className="no-messages request">
      <a href="#">
        <img
          className="avatar-xl"
          src={friend !== undefined ? `${baseUrl + friend.image_url}` : ""}
          title={friend !== undefined && friend.first_name}
          alt={friend !== undefined && friend.first_name}
        />
      </a>
      <h5>
        {frndMessage} <br />
        <span>{message}</span>
      </h5>
      <div className="options">
        {showButton === true && (
          <button
            onClick={() => props.handleFriendRequest("accept_friend_request", data)}
            className="btn button"
          >
            <i className="material-icons">check</i>
          </button>
        )}
        <button
          onClick={() => props.handleFriendRequest("delete_friend_request", data)}
          className="btn button bg-danger"
        >
          <i className="material-icons">close</i>
        </button>
      </div>
    </div>
  );
};

export default Request;
