import React from "react";

const Empty = (props) => {
  return (
    <div className="no-messages">
      <i className="material-icons md-48">forum</i>
      <p>
        Seems {props.otherUserName} is shy to start the chat. Break the ice send
        the first message.
      </p>
    </div>
  );
};

export default Empty;
