import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as bActions from "../../store/actions/base";
import * as cActions from "../../store/actions/chat";
import * as eActions from "../../store/actions/emojis";
import BottomBar from "./BottomBar.jsx";
import Center from "./Center.jsx";
import TopBar from "./TopBar.jsx";

const Body = (props) => {
  const {
    chat_name,
    username,
    eKeys,
    emojis,
    friend,
    disabled,
    blockContact,
    hideChat,
    stopChat,
    messages,
    mLoading,
    rLoading,
    loadEmojis,
    clearHistory,
    deleteContact,
    handleRequest,
    getMoreMessages,
  } = props;

  // useEffect(() => {
  //   loadEmojis();
  // }, [])

  const performAction = (params) => {
    const command = params["command"];
    const contact = params["friend"] && params["friend"];
    const data = { command, chat_name, friend: contact, username };
    switch (command) {
      case "go_back":
        return stopChat(chat_name, username);
      case "block_contact":
        return blockContact(data);
      case "clear_history":
        return clearHistory(chat_name, username);
      case "hide_chat":
        return hideChat(chat_name, username);
      case "delete_contact":
        return deleteContact(data);
      default:
        return;
    }
  };
  const images = eKeys !== null && eKeys !== undefined && eKeys.map((key) => (
    <div><img src={`http://localhost:8000${emojis[key]}`} alt={`emoji-${key}`} /></div>
  ))
  const base = (
    <div className="aside order-md-2">
      <div className="container">
        <div className="col-md-12">
          <div className="preference">
            <h2>Hello, Friend!</h2>
            <p>
              Go to the Discussion Section and Start a new Chat or Follow Up on
              an existing One!
            </p>
            {
              emojis !== null && emojis !== undefined && eKeys !== null && eKeys !== undefined &&
              <div className="d-flex justify-content-between">
                {images}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
  const body = (
    <React.Fragment>
      <TopBar
        key={1}
        friend={friend}
        chatName={chat_name}
        loading={rLoading}
        performAction={performAction}
      />
      <Center
        key={2}
        username={username}
        chat_name={chat_name}
        friend={friend}
        messages={messages}
        loading={mLoading}
        stopChat={stopChat}
        getMoreMessages={getMoreMessages}
        handleRequest={handleRequest}
      />
      <BottomBar
        key={3}
        username={username}
        chat_name={chat_name}
        friend={friend}
        disabled={disabled}
      />
    </React.Fragment>
  );

  return (
    <div className="main">
      <div className="tab-content" id="nav-tabContent">
        <div className="babble tab-pane fade active show" id="list-chat">
          <div className="chat" id="chat1">
            {!chat_name || chat_name === false || chat_name === undefined
              ? base
              : body}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    chat_name: state.chat.name,
    disabled: state.chat.disabled,
    friend: state.chat.recipient && state.chat.recipient.user_info,
    messages: state.chat.messages,
    mLoading: state.chat.mLoading,
    rLoading: state.chat.rLoading,
    emojis: state.emojis.emojis,
    eKeys: state.emojis.keys,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    stopChat: (chat_name, username) =>
      dispatch(cActions.stopChat(chat_name, username)),
    blockContact: (data) => dispatch(bActions.blockContact(data)),
    clearHistory: (chat_name, username) =>
      dispatch(bActions.clearHistory(chat_name, username)),
    hideChat: (chat_name, username) =>
      dispatch(bActions.hideChat(chat_name, username)),
    deleteContact: (data) => dispatch(cActions.deleteContact(data)),
    handleRequest: (data) => dispatch(cActions.handleRequest(data)),
    getMoreMessages: (chat_name, username, number) =>
      dispatch(cActions.getMoreMessages(chat_name, username, number)),
    loadEmojis: () => dispatch(eActions.loadEmojis()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Body);

/*
  <div className="call" id="call1">
    <div className="content">
      <div className="container">
        <div className="col-md-12">
          <div className="inside">
            <div className="panel">
              <div className="participant">
                <img className="avatar-xxl" src="dist/img/avatars/avatar-female-5.jpg" alt="avatar" />
                <span>Connecting</span>
              </div>              
              <div className="options">
                <button className="btn option"><i className="material-icons md-30">mic</i></button>
                <button className="btn option"><i className="material-icons md-30">videocam</i></button>
                <button className="btn option call-end"><i className="material-icons md-30">call_end</i></button>
                <button className="btn option"><i className="material-icons md-30">person_add</i></button>
                <button className="btn option"><i className="material-icons md-30">volume_up</i></button>
              </div>
              <button className="btn back" name="1"><i className="material-icons md-24">chat</i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
*/
