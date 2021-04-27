import * as actionTypes from "./actionTypes";
import { BaseInstance } from "../../websocket";

const command = "get_user_notifications";
const add_command = "new_notification";
const seen_command = "seen_notifications";

export const notificationsStart = () => {
  return {
  	type: actionTypes.NOTIFICATIONS_START
  };
};

export const notificationsSuccess = (notifications) => {
  return {
  	type: actionTypes.NOTIFICATIONS_SUCCESS,
  	notifications,
  };
};

export const notificationsSeen = (chat_name) => {
  return {
  	type: actionTypes.NOTIFICATIONS_SEEN,
  	chat_name,
  };
};

export const notificationsAdd = (notification) => {
  return {
  	type: actionTypes.NOTIFICATIONS_ADD,
  	notification,
  }
}

const myNotifications = (dispatch) => (notifications) => {
  dispatch(notificationsSuccess(notifications));
  // return BaseInstance.removeCallback(command);
};

export const addNotification = (dispatch) => (notification) => {
  return dispatch(notificationsAdd(notification));
};

export const seenNotifications = (dispatch) => (chat_name) => {
 return dispatch(notificationsSeen(chat_name));
};

export const getNotifications = (username) => {
  return (dispatch) => {
    BaseInstance.addCallback(command, myNotifications(dispatch));
    BaseInstance.addCallback(add_command, addNotification(dispatch));
    BaseInstance.addCallback(seen_command, seenNotifications(dispatch));
  	dispatch(notificationsStart());
  	BaseInstance.performAction({ command, username });
  };
};