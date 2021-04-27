import React, { useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/base";
import { baseUrl, loadingDiv } from "../../../constants";

const Popup = (props) => {
  const myUsername = props.username;
  const discussions = props.discussions;
  const contacts = props.contacts;
  const createChat = props.createChat;

  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorClass, setErrorClass] = useState(
    "d-none text-danger font-weight-bold font-italic"
  );
  const [errorMessage, setErrorMessage] = useState(
    "No Contact with specified Username!"
  );
  const [successClass, setSuccessClass] = useState(
    "d-none text-success font-weight-bold font-italic"
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [contactClass, setContactClass] = useState("d-none user");

  const handleClick = () => {
    setContactClass("d-none user");
  };

  const handleChange = (event) => {
    return event.target.name === "recipient"
      ? (setRecipient(event.target.value),
        setErrorClass("d-none text-danger font-weight-bold font-italic"),
        setContactClass("d-none user"))
      : setMessage(event.target.value);
  };

  const getMyDiscussions = (recipient) => {
    const userInfo = contacts.filter(
      (contact) => contact.user_info.username === recipient
    )[0];
    const usernames = discussions.map((discussion) => discussion.username);
    return usernames.includes(recipient)
      ? (setDisabled(true),
        setErrorClass("text-danger font-weight-bold font-italic"),
        setErrorMessage(`You have an existing Discussion with ${recipient}!`))
      : (setContactClass("user"), setUserInfo(userInfo), setDisabled(false));
  };

  const getUserInformation = (username) => {
    if (myUsername === username) {
      return (
        setDisabled(true),
        setErrorMessage("You cannot have a discussion with yourself!"),
        setErrorClass("text-danger font-weight-bold font-italic")
      );
    } else {
      const userInfo = contacts.filter(
        (contact) => contact.user_info.username === username
      )[0];
      return userInfo
        ? getMyDiscussions(username)
        : (setDisabled(true),
          setErrorClass("text-danger font-weight-bold font-italic"),
          setErrorMessage(`${username} is not in your Contacts!`));
    }
  };

  const handleUserVerification = (username) => {
    const userName = username.toLowerCase();
    return userName !== "" && getUserInformation(userName);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      'command': 'create_chat',
      'sender': myUsername,
      recipient,
      message,
    }
    createChat(data);
    setRecipient("");
    setMessage("");
    handleClick();
    return props.handlePopClass();
    
  };

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="requests">
        <div className="title">
          <h1>Start new chat</h1>
          <button
            onClick={props.handlePopClass}
            type="button"
            className="btn modal-button"
          >
            <i className="material-icons">close</i>
          </button>
        </div>
        <div>
          <p className={successClass}>{successMessage}</p>
        </div>
        <div className="content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Recipient:</label>
              <input
                onChange={handleChange}
                onBlur={() => handleUserVerification(recipient)}
                type="text"
                className="form-control"
                id="participant"
                name="recipient"
                placeholder="Add recipient..."
                value={recipient}
                required={true}
              />
              <div>
                <p className={errorClass}>{errorMessage}</p>
              </div>
              <div className={contactClass} id="recipient">
                <img
                  className="avatar-sm"
                  src={
                    userInfo.user_info !== undefined
                      ? `${baseUrl + userInfo.user_info.image_url}`
                      : ""
                  }
                  alt={
                    userInfo.user_info !== undefined
                      ? userInfo.user_info.first_name
                      : "avatar"
                  }
                />
                <h5>{`${
                  userInfo.user_info !== undefined &&
                  userInfo.user_info.first_name
                } ${
                  userInfo.user_info !== undefined &&
                  userInfo.user_info.last_name
                }`}</h5>
                <button className="btn" onClick={handleClick}>
                  <i className="material-icons">close</i>
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Message:</label>
              <textarea
                onChange={handleChange}
                className="text-control"
                id="message"
                name="message"
                placeholder="Send your welcome message..."
                value={message}
                required={true}
              />
            </div>
            {loading === true && loadingDiv}
            <button
              type="submit"
              className="btn button w-100"
              disabled={disabled}
            >
              Start New Chat
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    createChat: (data) => dispatch(actions.createChat(data)),
  }
}

export default connect(null, mapDispatchToProps)(Popup);
