import React, { useEffect, useRef, useState } from "react";
import { baseUrl, loadingDiv } from "../../constants";
import Chat from "./containers/Chat.jsx";
import Empty from "./containers/Empty.jsx";
import Request from "./containers/Request.jsx";

const Center = (props) => {
  const {
    chat_name,
    friend,
    username,
    loading,
    stopChat,
    messages,
    handleRequest,
    getMoreMessages,
  } = props;

  const startMsgDivRef = useRef(null);

  useEffect(() => {
    return () => {
      stopChat(chat_name, username);
    };
  }, []);

  const fetchMessages = (number) => {
    return getMoreMessages(chat_name, username, number);
  };

  const handleFriendRequest = (command, data) => {
    return handleRequest({ command, ...data });
  };

  const center =
    friend !== null && friend.is_friend === false ? (
      <Request
        key={1}
        chatName={chat_name}
        username={username}
        friend={friend !== null && friend}
        handleFriendRequest={handleFriendRequest}
      />
    ) : messages !== null && messages.length === 0 ? (
      <Empty
        key={2}
        username={username}
        otherUserName={friend !== null && friend.username}
        otherUserImage={friend !== null && `${baseUrl + friend.image_url}`}
      />
    ) : (
      <Chat
        key={2}
        chatName={chat_name}
        username={username}
        messages={messages}
        fetchMessages={fetchMessages}
      />
    );

  return (
    <div className="content empty" id="content" ref={startMsgDivRef}>
      <div className="container">
        <div className="col-md-12">
          {loading === true ? loadingDiv : center}
        </div>
      </div>
    </div>
  );
};

export default Center;
