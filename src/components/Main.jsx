import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { baseUrl } from "../constants";
import * as bActions from "../store/actions/base";
import Body from "./body components/Body.jsx";
import NavBar from "./nav components/NavBar.jsx";
import SideBar from "./side components/SideBar.jsx";
import useRefreshIcon from "../hooks/useRefreshIcon.jsx";

const Main = (props) => {
  const { info, username, conect, disconnect } = props;
  const image = info.user_info !== undefined && `${baseUrl + info.user_info.image_url}`;

  const [sideComponentName, setSideComponentName] = useState("discussion");

  useEffect(() => {

    if (conect !== undefined) {
      conect(username)
    }

    return () => {
      disconnect(username);
    };
  }, []);

  const handleSideChange = (compName) => {
    setSideComponentName(compName);
  };

  const navBar = (
    <NavBar
      key={1}
      handleSideChange={handleSideChange}
      username={username}
      imageUrl={image}
    />
  );
  const sideBar = (
    <SideBar
      key={2}
      component_name={sideComponentName}
      username={username}
    />
  );
  const body = (
    <Body
      key={3}
      username={username}
    />
  );

  return (
    username && (
      <React.Fragment>
        {navBar}
        {sideBar}
        {body}
      </React.Fragment>
    )
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    username: state.auth.username,
    info: state.info.myInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    conect: (username) => dispatch(bActions.connectBase(username)),
    disconnect: (username) => dispatch(bActions.disconnectBase(username)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
