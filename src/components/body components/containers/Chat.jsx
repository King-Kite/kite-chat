import React, { useEffect, useRef, useState } from "react";
import Message from "../chat components/Message.jsx";
import useRefreshIcon from "../../../hooks/useRefreshIcon.jsx";

const Chat = (props) => {
  const { messages, username } = props;
  
  const messagesEndRef = useRef(null);

  const MessageList = messages.map((message) => (
    <Message key={message.id} username={username} message={message} />
  ));

  const fetchMessages = () => {
    return props.fetchMessages(messages.length + 10);
  };

  const refresh = useRefreshIcon(fetchMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    refresh.handleClick(false);
  }, [messages]);

  return (
    <React.Fragment>
      <div className="d-flex justify-content-center">
        <span>Click icon to get older messages...</span>
        {refresh.button}
      </div>
      {MessageList}
      <div id="endMessages" ref={messagesEndRef} />
    </React.Fragment>
  );
};

export default Chat;
