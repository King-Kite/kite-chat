import * as actionTypes from "./actionTypes";
import { accountRegistrationUrl, accountLoginUrl } from "../../constants";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, username) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token, username
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

const saveToken = (token, username, dispatch) => {
  const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
  localStorage.setItem("token", token);
  localStorage.setItem("username", username)
  localStorage.setItem("expirationDate", expirationDate);
  dispatch(authSuccess(token, username));
  dispatch(checkAuthTimeout(3600));
};

export const authLogin = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    fetch(accountLoginUrl, {
      method: "post",
      body: form,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.key !== null && data.key !== undefined) {
          saveToken(data.key, username, dispatch);
        } else {
          const errorMessage = {
            message1: "Username or Password is Incorrect!",
            message2: "Note: Password is CaSe SeNsItIvE!",
          };
          dispatch(authFail(errorMessage));
        }
      })
      .catch((error) => {
        dispatch(authFail(error));
      });
  };
};

export const authSignup = (username, email, password1, password2) => {
  return (dispatch) => {
    dispatch(authStart());
    const form = new FormData();
    form.append("username", username);
    form.append("email", email);
    form.append("password1", password1);
    form.append("password2", password2);
    fetch(accountRegistrationUrl, {
      method: "post",
      body: form,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.key !== null && data.key !== undefined) {
          saveToken(data.key, username, dispatch);
        } else {
          const errorMessage = {
            message: "Invalid Parameters!",
          };
          dispatch(authFail(errorMessage));
        }
      })
      .catch((error) => {
        dispatch(authFail(error));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token, username));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
