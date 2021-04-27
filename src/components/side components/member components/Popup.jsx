import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/base";
import { baseUrl, loadingDiv } from "../../../constants";

const Popup = (props) => {
  const {
    loading,
    error,
    r_error,
    success,
    recipient,
    contacts,
    contactInfo,
    createRequest,
    getContactInfo,
  } = props;
  const my_username = props.username;
  const [contactClass, setContactClass] = useState("d-none");

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [errorClass, setErrorClass] = useState(
    "d-none text-danger font-weight-bold font-italic"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [successClass, setSuccessClass] = useState(
    "text-center font-weight-bold font-italic"
  );

  useEffect(() => {
    if (contactInfo === null || contactInfo === undefined) {
      setContactClass("d-none");
      setDisabled(true);
      if (username !== "") {
        setErrorMessage(error);
        setErrorClass("text-danger font-weight-bold font-italic");
      }
    } else {
      setContactClass("user");
      setDisabled(false);
    }
  }, [contactInfo, recipient]);

  const handleClick = () => {
    setContactClass("d-none");
  };

  const handleChange = (event) => {
    return event.target.name === "username"
      ? (setUsername(event.target.value),
        setErrorClass("d-none text-danger font-weight-bold font-italic"),
        setContactClass("d-none user"))
      : setMessage(event.target.value);
  };

  const getUserInformation = (username, my_username) => {
    if (username !== undefined && my_username !== undefined) {
      if (username === my_username) {
        return (
          setDisabled(true),
          setErrorMessage("You cannot add yourself as a Contact"),
          setErrorClass("text-danger font-weight-bold font-italic")
        );
      } else {
        const users = contacts !== null &&
          contacts !== undefined &&
          contacts.length > 0 &&
          contacts.filter((contact) => {
            return contact.user_info.username === username && contact;
          });
        if (users.length > 0) {
          return (
            setDisabled(true),
            setErrorClass("text-danger font-weight-bold font-italic"),
            setErrorMessage("This user is already on your Contacts!")
          );
        } else {
          const data = {
            command: "get_contact_info",
            username: my_username,
            contact: username,
          };
          getContactInfo(data);
        }
      }
    }
  };

  const handleUserVerification = (username) => {
    setContactClass("d-none user");
    const userName = username.toLowerCase();
    if (userName !== undefined && userName !== "") {
      getUserInformation(userName, my_username);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      command: "new_friend_request",
      sender: my_username,
      recipient: username,
      message,
    };
    return createRequest(data);
  };

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="requests">
        <div className="title">
          <h1>Add your friends</h1>
          <button
            onClick={props.handlePopClass}
            type="button"
            className="btn modal-button"
          >
            <i className="material-icons">close</i>
          </button>
        </div>
        <div>
          {success !== null && success !== undefined ? (
            <p className={`${successClass} text-success`}>{success}</p>
          ) : (
            r_error !== null &&
            r_error !== undefined && (
              <p className={`${successClass} text-danger`}>{r_error}</p>
            )
          )}
        </div>
        <div className="content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username:</label>
              <input
                onChange={handleChange}
                onBlur={() => handleUserVerification(username)}
                type="text"
                className="form-control"
                id="user"
                name="username"
                placeholder="Add recipient..."
                value={username}
                required={true}
              />
              <div>
                <p className={errorClass}>{errorMessage}</p>
              </div>
              <div className={contactClass} id="contact">
                <img
                  className="avatar-sm"
                  src={
                    contactInfo &&
                    contactInfo !== undefined &&
                    baseUrl + contactInfo.image_url
                  }
                  alt={
                    contactInfo &&
                    contactInfo !== undefined &&
                    contactInfo.first_name
                  }
                />
                <h5>
                  {contactInfo &&
                    contactInfo !== undefined &&
                    contactInfo.first_name + " " + contactInfo.last_name}
                </h5>
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
                id="welcome"
                name="message"
                placeholder="Send your welcome message..."
                // value={message !== null ? message : `Hi ${username}, I'd like to add you as a contact.`}
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
              Send Friend Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    loading: state.contacts.rLoading,
    error: state.contacts.error,
    r_error: state.contacts.r_error,
    success: state.contacts.success,
    contactInfo: state.contacts.cInfo,
    recipient: state.contacts.recipient,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createRequest: (data) => dispatch(actions.createFriendRequest(data)),
    getContactInfo: (data) => dispatch(actions.getContactInfo(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
