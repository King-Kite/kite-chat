import * as actionTypes from "./actionTypes";
import { BaseInstance, ChatInstance } from "../../websocket";

const disconnect_presence = "disconnect_presence";
const clear_history = "clear_history";
const hide_chat = "hide_chat";
const block_contact = "block_contact";
const handle_request = "handle_request";
const create_chat = "create_chat";
const new_friend_request = "new_friend_request";
const get_contact_info = "get_contact_info";

export const baseConnectFail = () => {
  return {
    type: actionTypes.BASE_CONNECT_FAIL,
  };
};

const waitForSocketConnection = (callback, dispatch) => {
  setTimeout(function () {
    if (BaseInstance.state() === 1) {
      callback();
      return;
    } else {
      // dispatch !== undefined && dispatch(baseConnectFail());
      waitForSocketConnection(callback);
    }
  }, 100);
};

export const baseConnected = () => {
  return {
    type: actionTypes.BASE_CONNECTED,
  };
};

const securedConnection = (username, dispatch) => () => {
  // return dispatch(baseConnected());
};

export const baseStart = (username, dispatch) => {
  BaseInstance.connect(username, username);
  waitForSocketConnection(securedConnection(username, dispatch), dispatch);
  return {
    type: actionTypes.BASE_CONNECT_START,
    username,
  };
};

export const baseDisconnect = (username) => {
  BaseInstance.performAction({
    command: disconnect_presence,
    chat_name: username,
    username,
  });
  BaseInstance.disconnect();
  return {
    type: actionTypes.BASE_DISCONNECT,
  };
};

const blockRecipient = (data) => {
  return {
    type: actionTypes.CHAT_BLOCK_RECIPIENT,
    chat_name: data.chat_name,
    recipient: data.friend,
  };
};

const unBlockRecipient = (data) => {
  return {
    type: actionTypes.CHAT_UNBLOCK_RECIPIENT,
    chat_name: data.chat_name,
    recipient: data.friend,
  };
};

const addContact = (contact) => {
  return {
    type: actionTypes.CONTACTS_ADD,
    contact,
  };
};

const handleRequest = (data, type, dispatch) => {
  if (type === actionTypes.CHAT_ACCEPT_REQUEST) {
    dispatch(addContact(data.friend));
  }
  return {
    type,
    chat_name: data.chat_name,
    friend: data.friend.user_info && data.friend.user_info.username,
  };
};

const chatHide = (chat_name, username) => {
  switch (chat_name) {
    case "all":
      BaseInstance.performAction({
        command: hide_chat,
        chat_name,
        username,
      });
      break;
    default:
      ChatInstance.performAction({
        command: hide_chat,
        chat_name,
        username,
      });
      break;
  }
  return {
    type: actionTypes.CHAT_HIDE,
    chat_name,
  };
};

const chatCreated = (data) => {
  return {
    type: actionTypes.CHAT_CREATED,
    name: data["chat_name"],
    username: data["username"],
  };
};

const addDisucssion = (discussion) => {
  return {
    type: actionTypes.DISCUSSIONS_ADD,
    discussion,
  };
};

const requestCreated = (data, dispatch) => {
  if (data["error"]) {
    return {
      type: actionTypes.CONTACTS_REQUEST_FAIL,
      error: data["error"],
    };
  } else if (data["success"]) {
    if (data["friend"] !== null && data["friend"] !== undefined) {
      dispatch(addDisucssion(data["friend"]));
    }
    return {
      type: actionTypes.CONTACTS_REQUEST_SUCCESS,
      success: data['success']
    };
  }
};

const chatCreate = (data) => {
  BaseInstance.performAction(data);

  return {
    type: actionTypes.CHAT_CREATE,
    sender: data["sender"],
    recipient: data["recipient"],
  };
};

const requestStart = (data) => {
  BaseInstance.performAction(data);

  return {
    type: actionTypes.CONTACTS_REQUEST_START,
    sender: data["sender"],
    recipient: data["recipient"],
  };
};

const clearChatHistory = (chat_name, username) => {
  switch (chat_name) {
    case "all":
      BaseInstance.performAction({
        command: clear_history,
        chat_name,
        username,
      });
      break;
    default:
      ChatInstance.performAction({
        command: clear_history,
        chat_name,
        username,
      });
      break;
  }
  return {
    type: actionTypes.CHAT_CLEAR_HISTORY,
    chat_name,
  };
};

const checkBlocked = (dispatch) => (data) => {
  if (data.command === "block") {
    dispatch(blockRecipient(data));
  } else {
    dispatch(unBlockRecipient(data));
  }
};

const checkRequest = (dispatch) => (data) => {
  const type =
    data.command === "accept"
      ? actionTypes.CHAT_ACCEPT_REQUEST
      : actionTypes.CHAT_DELETE_REQUEST;
  dispatch(handleRequest(data, type, dispatch));
};

const createdChat = (dispatch) => (data) => {
  return dispatch(chatCreated(data));
};

const createdRequest = (dispatch) => (data) => {
  return dispatch(requestCreated(data, dispatch));
};

const infoContact = (contact) => {
  return {
    type: actionTypes.CONTACTS_INFO_CONTACT,
    contact
  };
};

const contactInfo = (dispatch) => (data) => {
  return dispatch(infoContact(data))
}

export const connectBase = (username) => {
  return (dispatch) => {
    BaseInstance.addCallback(handle_request, checkRequest(dispatch));
    dispatch(baseStart(username, dispatch));
  };
};

export const disconnectBase = (username) => {
  return (dispatch) => {
    dispatch(baseDisconnect(username));
  };
};

export const blockContact = (data) => {
  return (dispatch) => {
    BaseInstance.addCallback(block_contact, checkBlocked(dispatch));
    BaseInstance.performAction(data);
  };
};

export const clearHistory = (chat_name, username) => {
  return (dispatch) => {
    dispatch(clearChatHistory(chat_name, username));
  };
};

export const hideChat = (chat_name, username) => {
  return (dispatch) => {
    dispatch(chatHide(chat_name, username));
  };
};

export const createChat = (data) => {
  return (dispatch) => {
    BaseInstance.addCallback(create_chat, createdChat(dispatch));
    dispatch(chatCreate(data));
  };
};

export const createFriendRequest = (data) => {
  return (dispatch) => {
    BaseInstance.addCallback(new_friend_request, createdRequest(dispatch));
    dispatch(requestStart(data));
  };
};

export const getContactInfo = (data) => {
  return (dispatch) => {
    BaseInstance.addCallback(get_contact_info, contactInfo(dispatch));
    BaseInstance.performAction(data);
  }
}