import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadingDiv } from "./constants";
import Authenticate from "./components/Authenticate.jsx";
import Main from "./components/Main.jsx";
import * as actions from "./store/actions/auth";
// import "./dist/css/mine.dark.css";
// import "./dist/css/swipe.min.css";

const App = (props) => {
  const { loading, isAuthenticated } = props;

  useEffect(() => {
    props.onTryAutoSignup();
  }, []);

  const authenticate = (
    <div className="layout">
      <Authenticate key={1} {...props} />
    </div>
  );
  const main = (
    <div className="layout">
      <Main key={2} {...props} />
    </div>
  );

  if (loading === true) {
    return loadingDiv;
  } else if (isAuthenticated === false) {
    return authenticate;
  }

  return main;
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated:
      state.auth.token !== null && state.auth.token !== undefined
        ? true
        : false,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
