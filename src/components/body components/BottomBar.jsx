import React, { useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/chat";
// import Picker from "emoji-picker-react";
import { createMessageUrl } from "../../constants";
import Preview from "./Preview.jsx";
import useFormInput from "../../hooks/useFormInput.jsx";

const BottomBar = (props) => {
  const { chat_name, disabled, username, sendMessage } = props;

  const message = useFormInput("");
  const media = useFormInput("");

  // const [showEmoji, setShowEmoji] = useState('d-none');

  // const onEmojiClick = (event, emojiObject) => {
  //   message.handleEmoji(emojiObject)
  // };

  const handleMediaUpload = (file) => {
    const form = new FormData();
    form.append("chat", chat_name);
    form.append("contact", username);
    form.append("media", file.value);
    form.append("media_type", file.type);
    fetch(createMessageUrl, {
      method: "post",
      headers: {
        Authorization: "Token " + props.token,
      },
      body: form,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data !== undefined && data !== {}) {
          sendMessage !== null && sendMessage(data);
          media.onSubmit("");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (media.value && media.value !== "") {
      handleMediaUpload(media);
    }
    if (message.value !== "") {
      const newMessage = {
        command: "new_message",
        chat_name,
        username,
        message: message.value,
      };
      sendMessage !== null && sendMessage(newMessage);
      message.onSubmit("");
      // setShowEmoji("d-none");
    }
  };

  // const handleEmoji = () => {
  //   return showEmoji === "d-none" ?
  //     setShowEmoji("") : setShowEmoji("d-none");
  // };

  const status =
    disabled === false
      ? {
          placeholder: "Start typing for reply...",
          class_name: " ",
          disabled: false,
        }
      : {
          placeholder: "Messaging unavailable",
          class_name: " disabled ",
          disabled: true,
        };

  return (
    <React.Fragment>
    {/*<div className={showEmoji} style={{position: "absolute", bottom: 120}}>
      <Picker onEmojiClick={onEmojiClick} />
    </div>*/}
    <div className="container">
      <div className="col-md-12">
        {media.value !== "" && (
          <Preview
            image={media.type === "I" && media.valueUrl}
            name={media.name}
            size={media.size}
            type={media.type}
            handleClose={() => media.onSubmit("")}
          />
        )}
        <div className={media.value !== "" ? "bottom p-0" : "bottom"}>
          <form onSubmit={(event) => event.preventDefault()} className="position-relative w-100">
            <textarea
              onChange={message.onChange}
              className="form-control"
              name="message"
              placeholder={status.placeholder}
              rows="1"
              value={message.value}
              disabled={status.disabled}
            />
            <button
              className={"btn emoticons" + status.class_name}
              disabled={status.disabled}
            >
              <i className="material-icons">insert_emoticon</i>
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              className={"btn send" + status.class_name}
              disabled={status.disabled}
            >
              <i className="material-icons">send</i>
            </button>
          </form>
          <label>
            <input
              onChange={media.onChange}
              name="media"
              type="file"
              disabled={status.disabled}
            />
            <span
              className={"btn attach d-sm-block d-none" + status.class_name}
            >
              <i className="material-icons">attach_file</i>
            </span>
          </label>
        </div>
      </div>
    </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendMessage: (data) => dispatch(actions.sendMessage(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
