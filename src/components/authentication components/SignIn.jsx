import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as actions from "../../store/actions/auth";
import { loadingDiv } from "../../constants";

const SignIn = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    return name === "username" ? setUsername(value) : setPassword(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    let username = form.get("username");
    let password = form.get("password");
    props.onAuth(username, password);
  };

  let errorMessage1 = null;
  let errorMessage2 = null;
  if (props.error) {
    errorMessage1 = (
      <span className="text-danger font-weight-bold font-italic mb-2">
        {props.error.message1}
      </span>
    );
    errorMessage2 = (
      <span className="text-danger font-weight-bold font-italic mb-2">
        {props.error.message2}
      </span>
    );
  }

  return (
    <React.Fragment>
      <div className="main order-md-1">
        <div className="start">
          <div className="container">
            <div className="col-md-12">
              <div className="content">
                <h1>Sign in to Kite</h1>
                <div className="third-party">
                  <button className="btn item bg-blue">
                    <i className="material-icons">pages</i>
                  </button>
                  <button className="btn item bg-teal">
                    <i className="material-icons">party_mode</i>
                  </button>
                  <button className="btn item bg-purple">
                    <i className="material-icons">whatshot</i>
                  </button>
                </div>
                <p>or use your username and password:</p>
                <div>
                  {errorMessage1} <br />
                  {errorMessage2}
                </div>
                <form action="#" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      onChange={handleChange}
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      placeholder="Username"
                      required={true}
                      value={username}
                    />
                    <button className="btn icon">
                      <i className="material-icons">mail_outline</i>
                    </button>
                  </div>
                  <div className="form-group">
                    <input
                      onChange={handleChange}
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      required={true}
                      value={password}
                    />
                    <button className="btn icon">
                      <i className="material-icons">lock_outline</i>
                    </button>
                  </div>
                  {props.loading === true && loadingDiv}
                  <button type="submit" className="btn button">
                    Sign In
                  </button>
                  <div className="callout">
                    <span>
                      Don't have account?
                      <a onClick={props.handleAuthType} href="#">
                        Create Account
                      </a>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="aside order-md-2">
        <div className="container">
          <div className="col-md-12">
            <div className="preference">
              <h2>Hello, Friend!</h2>
              <p>
                Enter your personal details and start your journey with Kite
                today.
              </p>
              <a onClick={props.handleAuthType} href="#" className="btn button">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (username, password) =>
      dispatch(actions.authLogin(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
