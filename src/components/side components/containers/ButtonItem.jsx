import React from "react";

const ButtonItem = (props) => {
  return (
    <button
      onClick={() => props.handleStatus(props.name)}
      className={props.className}
    >
      {props.text}
    </button>
  );
};

export default ButtonItem;
