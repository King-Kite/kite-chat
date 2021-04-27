import React from "react";
import { baseUrl } from "../../../constants";

const Message = (props) => {
  const { message, username } = props;
  const msg_time = new Date(message.msg_time).toDateString();
  const me = message.username === username ? "me" : "";

  const msg_text = message.message && (
    <p>{message.message}</p>
  );

  const msg_document = message.media && (
    <div className="attachment">
      <a
        href={`${baseUrl + message.media.url}`}
        className="btn attach"
        download={message.media.name}
      >
        <i className="material-icons md-18">insert_drive_file</i>
      </a>
      <div className="file">
        <h5>
          <a
            href={`${baseUrl + message.media.url}`}
            download={message.media.name}
          >
            {message.media.name}
          </a>
        </h5>
        <span>{`${parseInt(message.media.size) / 1000}KB`} Document</span>
      </div>
    </div>
  );

  const msg_image = message.media && (
    <img
      className="img-responsive"
      width="200px"
      height="200px"
      src={`${baseUrl + message.media.url}`}
      alt={message.media.name}
    />
  );

  const msg_layout = () => {
    return message.message && message.message !== ""
      ? msg_text
      : message.media && message.kind === "I"
      ? msg_image
      : msg_document;
  };

  const result = (
    <div key={message.id} className={`message ${me}`}>
      {me === "" && (
        <img
          className="avatar-md"
          src={`${baseUrl + message.user_image}`}
          title={message.username}
          alt={message.username}
        />
      )}
      <div className="text-main">
        <div className={`text-group ${me}`}>
          <div className={`text ${me}`}>{msg_layout()}</div>
        </div>
        <span>{msg_time}</span>
      </div>
    </div>
  );

  return result;
};

export default Message;

// const iconsExp = /<span className="ec ec-[0-9a-z-]+"\s[/][>]/gim;
// const iconsClass = /"ec ec-[0-9a-z-]+"/gim;
