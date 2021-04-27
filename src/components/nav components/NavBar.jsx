import React, { useEffect, useState } from "react";
import NavBarData from "./NavBarData.jsx";
import NavBarItem from "./NavBarItem.jsx";
import WebSocketInstance from "../../websocket";
import { connect } from "react-redux";
import * as actions from "../../store/actions/auth";
import { loadingDiv } from "../../constants";

const NavBar = (props) => {
  const username = props.username;
  const image = props.imageUrl;

  const [data, setData] = useState(NavBarData);

  useEffect(() => {
    return () => {
      setData(NavBarData);
    }
  }, [])

  const handleClick = (id) => {
    const oldData = [...data];
    const navLink = oldData.filter((link) => {
      return link.id === id && link;
    })[0];
    const index = oldData.indexOf(navLink);
    const oid = oldData[index].id;

    const newData = oldData.filter((link) => {
      if (link.id === oid) {
        link.class_name = "material-icons active";
        link.b_class_name = "active";
      } else {
        link.class_name = "material-icons";
        link.b_class_name = "";
      }
      return link;
    });
    setData(newData);
    props.handleSideChange(oldData[index].name);
  };
  
  const navLinks = data.map((link) => (
    <NavBarItem
      key={link.id}
      id={link.id}
      class_name={link.class_name}
      b_class_name={link.b_class_name}
      type={link.type}
      text={link.text}
      handleClick={handleClick}
    />
  ));

  return (
    <div className="navigation">
      <div className="container">
        <div className="inside">
          <div className="nav nav-tab menu">
            <button className="btn">
              {image === false || image === undefined ? (
                loadingDiv
              ) : (
                <img className="avatar-xl" src={image} alt="avatar" />
              )}
            </button>
            {navLinks}
            <button onClick={props.logout} className="btn power">
              <i className="material-icons">power_settings_new</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(null, mapDispatchToProps)(NavBar);
