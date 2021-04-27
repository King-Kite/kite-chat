import React from "react";

const NavBarItem = (props) => {
  return (
    <a
      href="#"
      className={props.b_class_name}
      onClick={() => props.handleClick(props.id)}
    >
      <i className={props.class_name}>{props.text}</i>
    </a>
  );
};

export default NavBarItem;
