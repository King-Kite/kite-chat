import * as actionTypes from "./actionTypes";
import { BaseInstance, ChatInstance } from "../../websocket";

const fetch_messages = "fetch_messages";
const new_message = "new_message";
const get_recipient_info = "get_recipient_info";
const stop_chat = "stop_chat";
const disconnect_presence = "disconnect_presence";
const check_notification = "check_notification";
const accept_friend_request = "accept_friend_request";
const delete_friend_request = "delete_friend_request";

const setMessages = (dispatch) => (messages) => {
  return dispatch(chatMessagesSuccess(messages.reverse()));
};

const addMessage = (dispatch) => (message) => {
  return dispatch(chatMessagesAdd(message));
};

const setRecipientInfo = (dispatch) => (data) => {
  return dispatch(chatRecipientSuccess(data));
};

const getMessages = (chat_name, username, number, dispatch) => {
  dispatch !== null && dispatch !== undefined && dispatch(chatMessagesStart());
  ChatInstance.performAction({
    command: fetch_messages,
    chat_name,
    username,
    number,
  });
};

const getRecipientInfo = (chat_name, username, dispatch) => {
  dispatch(chatRecipientStart());
  BaseInstance.performAction({
    command: get_recipient_info,
    chat_name,
    username,
  });
};

export const chatFail = () => {
  return {
    type: actionTypes.CHAT_FAIL,
  };
};

const waitForSocketConnection = (callback, dispatch) => {
  setTimeout(function () {
    if (ChatInstance.state() === 1) {
      callback();
      return;
    } else {
      dispatch !== undefined && dispatch(chatFail());
      waitForSocketConnection(callback);
    }
  }, 100);
};

const securedConnection = (chat_name, username, dispatch) => () => {
  getMessages(chat_name, username, 10, dispatch);
  getRecipientInfo(chat_name, username, dispatch);
  ChatInstance.performAction({
    command: check_notification,
    chat_name,
    username,
  });
};

export const chatStop = (chat_name, username) => {
  if (chat_name !== null && chat_name !== undefined && username !== null) {
    ChatInstance.performAction({
      command: disconnect_presence,
      chat_name,
      username,
    });
    ChatInstance.disconnect();
  }
  return {
    type: actionTypes.CHAT_STOP,
  };
};

const stopChatD = (dispatch) => (chat_name) => {
  dispatch(chatStop(chat_name, null));
};

const manageCallbacks = (decision, dispatch) => {
  return decision === "add"
    ? (ChatInstance.addCallback(fetch_messages, setMessages(dispatch)),
      ChatInstance.addCallback(new_message, addMessage(dispatch)),
      BaseInstance.addCallback(get_recipient_info, setRecipientInfo(dispatch)),
      ChatInstance.addCallback(stop_chat, stopChatD(dispatch)))
    : (ChatInstance.removeCallback(fetch_messages),
      ChatInstance.removeCallback(new_message),
      BaseInstance.removeCallback(get_recipient_info),
      ChatInstance.removeCallback(stop_chat));
};

export const chatMessagesStart = () => {
  return {
    type: actionTypes.CHAT_MESSAGES_START,
  };
};

export const chatMessagesSuccess = (messages) => {
  return {
    type: actionTypes.CHAT_MESSAGES_SUCCESS,
    messages,
  };
};

export const chatMessagesAdd = (message) => {
  return {
    type: actionTypes.CHAT_MESSAGES_ADD,
    message,
  };
};

export const chatRecipientStart = () => {
  return {
    type: actionTypes.CHAT_RECIPIENT_START,
  };
};

export const chatRecipientSuccess = (recipient) => {
  return {
    type: actionTypes.CHAT_RECIPIENT_SUCCESS,
    recipient,
  };
};

export const chatRecipientDelete = (data) => {
  ChatInstance.performAction(data);
  return {
    type: actionTypes.CHAT_RECIPIENT_DELETE,
  };
};

export const chatHandleRequest = (data) => {
  ChatInstance.performAction(data);
  return {
    type: actionTypes.CHAT_HANDLE_REQUEST
  };
};

export const chatStart = (name, username, dispatch) => {
  ChatInstance.connect(name, username);
  waitForSocketConnection(
    securedConnection(name, username, dispatch),
    dispatch
  );
  return {
    type: actionTypes.CHAT_START,
    name,
    username,
  };
};

export const chatMessageSend = (data) => {
  ChatInstance.performAction(data);
  return {
    type: actionTypes.CHAT_MESSAGE_SEND,
    message: data.message,
  };
};

export const startChat = (name, username) => {
  return (dispatch) => {
    manageCallbacks("add", dispatch);
    dispatch(chatStart(name, username, dispatch));
  };
};

export const stopChat = (name, username) => {
  manageCallbacks("remove");
  return (dispatch) => {
    dispatch(chatStop(name, username));
  };
};

export const sendMessage = (data) => {
  return (dispatch) => {
    dispatch(chatMessageSend(data));
  };
};

export const deleteContact = (data) => {
  return (dispatch) => {
    dispatch(chatRecipientDelete(data));
  };
};

export const handleRequest = (data) => {
  return (dispatch) => {
    dispatch(chatHandleRequest(data));
  };
};

export const getMoreMessages = (chat_name, username, number) => {
  return (dispatch) => {
    getMessages(chat_name, username, number, dispatch);
  };
};
