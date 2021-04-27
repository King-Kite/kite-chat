import React, { useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/auth";
import { loadingDiv } from "../../constants";

const SignUp = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    return name === "username"
      ? setUsername(value)
      : name === "email"
      ? setEmail(value)
      : name === "password1"
      ? setPassword1(value)
      : setPassword2(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    let username = form.get("username");
    let email = form.get("email");
    let password1 = form.get("password1");
    let password2 = form.get("password2");
    props.onAuth(username, email, password1, password2);
  };

  let errorMessage = null;
  if (props.error) {
    errorMessage = (
      <span className="text-danger font-weight-bold font-italic mb-2">
        {props.error.message}
      </span>
    );
  }

  return (
    <React.Fragment>
      <div className="main order-md-2">
        <div className="start">
          <div className="container">
            <div className="col-md-12">
              <div className="content">
                <h1>Create Account</h1>
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
                <p>or use your email for registration:</p>
                <div>{errorMessage}</div>
                <form onSubmit={handleSubmit} className="signup">
                  <div className="form-parent">
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
                        <i className="material-icons">person_outline</i>
                      </button>
                    </div>
                    <div className="form-group">
                      <input
                        onChange={handleChange}
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="Email Address"
                        required={true}
                        value={email}
                      />
                      <button className="btn icon">
                        <i className="material-icons">mail_outline</i>
                      </button>
                    </div>
                  </div>
                  <div className="form-parent">
                    <div className="form-group">
                      <input
                        onChange={handleChange}
                        type="password"
                        id="password1"
                        name="password1"
                        className="form-control"
                        placeholder="Password"
                        required={true}
                        value={password1}
                      />
                      <button className="btn icon">
                        <i className="material-icons">lock_outline</i>
                      </button>
                    </div>
                    <div className="form-group">
                      <input
                        onChange={handleChange}
                        type="password"
                        id="password2"
                        name="password2"
                        className="form-control"
                        placeholder="Confirm Password"
                        required={true}
                        value={password2}
                      />
                      <button className="btn icon">
                        <i className="material-icons">lock_outline</i>
                      </button>
                    </div>
                  </div>
                  {props.loading === true && loadingDiv}
                  <button type="submit" className="btn button">
                    Sign Up
                  </button>
                  <div className="callout">
                    <span>
                      Already a member?
                      <a onClick={props.handleAuthType} href="#">
                        Sign In
                      </a>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="aside order-md-1">
        <div className="container">
          <div className="col-md-12">
            <div className="preference">
              <h2>Welcome Back!</h2>
              <p>
                To keep connected with your friends please login with your
                personal info.
              </p>
              <a onClick={props.handleAuthType} href="#" className="btn button">
                Sign In
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
    onAuth: (username, email, password1, password2) => {
      dispatch(actions.authSignup(username, email, password1, password2));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
