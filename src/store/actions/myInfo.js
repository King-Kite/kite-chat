import * as actionTypes from "./actionTypes";
import { BaseInstance } from "../../websocket";

const command = "get_user_data";

export const myInfoStart = () => {
  return {
  	type: actionTypes.MY_INFO_START
  };
};

export const myInfoSuccess = (myInfo) => {
  return {
  	type: actionTypes.MY_INFO_SUCCESS,
  	myInfo,
  };
};

export const myInfoFail = (error) => {
  return {
    type: actionTypes.MY_INFO_FAIL,
    error
  }
}

export const myInfoUpdate = (info) => {
  return {
    type: actionTypes.MY_INFO_UPDATE,
    info
  };
};

const myInfo = (dispatch) => (myInfo) => {
  dispatch(myInfoSuccess(myInfo));
  return BaseInstance.removeCallback(command);
};

export const getMyInfo = (username) => {
  return (dispatch) => {
    BaseInstance.addCallback(command, myInfo(dispatch));
  	dispatch(myInfoStart());
  	BaseInstance.performAction({ command, username });
  };
};

export const updateInfo = (info) => {
  return (dispatch) => {
    dispatch(myInfoUpdate(info));
  };
};

export const updateFailed = (error) => {
  return (dispatch) => {
    dispatch(myInfoFail(error));
  };
};
