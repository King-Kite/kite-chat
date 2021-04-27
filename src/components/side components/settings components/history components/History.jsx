import React from "react";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/base";
import useFormInput from "../../../../hooks/useFormInput.jsx";
import useDropDown from "../../../../hooks/useDropDown.jsx";

const History = (props) => {
  const { clearHistory, hideChat, username } = props;
  const chat_name = "all";
  const chat = useFormInput(false);
  const message = useFormInput(false);
  const dropDown = useDropDown("collapse", "title collapsed");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (chat.value === true) {
      hideChat(chat_name, username);
    }
    if (message.value === true) {
      clearHistory(chat_name, username);
    }
  };

  return (
    <div className="category">
      <a
        onClick={dropDown.handleClick}
        href="#"
        className={dropDown.aValue}
        id="headingTwo"
      >
        <i className="material-icons md-30 online">mail_outline</i>
        <div className="data">
          <h5>Chats</h5>
          <p>Check your chat history</p>
        </div>
        <i className="material-icons">keyboard_arrow_right</i>
      </a>
      <div className={dropDown.divValue} id="collapseTwo">
        <div className="content layer">
          <div className="history">
            <p>
              When you clear your conversation history, the messages will be
              deleted from your own device.
            </p>
            <p>
              The messages won't be deleted or cleared on the devices of the
              people you chatted with.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="custom-control custom-checkbox">
                <input
                  onChange={chat.onChange}
                  type="checkbox"
                  className=""
                  id="chat"
                  name="chat"
                  checked={chat.value}
                />
                <label className="custom-control-label">
                  Hide will remove your chat history from the recent list.
                </label>
              </div>
              <div className="custom-control custom-checkbox">
                <input
                  onChange={message.onChange}
                  type="checkbox"
                  className=""
                  id="message"
                  name="message"
                  checked={message.value}
                />
                <label className="custom-control-label">
                  Delete will remove your messages from your chats.
                </label>
              </div>
              <button type="submit" className="btn button w-100">
                Clear blah-blah
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearHistory: (chat_name, username) =>
      dispatch(actions.clearHistory(chat_name, username)),
    hideChat: (chat_name, username) =>
      dispatch(actions.hideChat(chat_name, username)),
  };
};

export default connect(null, mapDispatchToProps)(History);
