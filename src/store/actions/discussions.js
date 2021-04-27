import * as actionTypes from "./actionTypes";
import { BaseInstance } from "../../websocket";

const command = "get_user_discussions";
const add_command = "new_discussion";
const remove_command = "remove_discussion";
const update_command = "update_discussions";

export const discussionsStart = () => {
  return {
  	type: actionTypes.DISCUSSIONS_START
  };
};

export const discussionsSuccess = (discussions) => {
  return {
  	type: actionTypes.DISCUSSIONS_SUCCESS,
  	discussions,
  };
};

export const discussionsUpdate = (data) => {
  return {
  	type: actionTypes.DISCUSSIONS_UPDATE,
  	chat_name: data.chat_name,
    count: data.count,
  };
};

export const discussionsAdd = (discussion) => {
  return {
  	type: actionTypes.DISCUSSIONS_ADD,
  	discussion,
  }
}

export const discussionsRemove = (discussion) => {
  return {
    type: actionTypes.DISCUSSIONS_REMOVE,
    discussion,
  }
}

const myDiscussions = (dispatch) => (discussions) => {
  dispatch(discussionsSuccess(discussions));
  return BaseInstance.removeCallback(command);
};

export const addDiscussion = (dispatch) => (discussion) => {
  return dispatch(discussionsAdd(discussion));
};

export const removeDiscussion = (dispatch) => (discussion) => {
  return dispatch(discussionsRemove(discussion));
};

export const updateDiscussions = (dispatch) => (data) => {
 return dispatch(discussionsUpdate(data));
};

export const getDiscussions = (username) => {
  return (dispatch) => {
    BaseInstance.addCallback(command, myDiscussions(dispatch));
    BaseInstance.addCallback(add_command, addDiscussion(dispatch));
    BaseInstance.addCallback(remove_command, removeDiscussion(dispatch));
    BaseInstance.addCallback(update_command, updateDiscussions(dispatch));
  	dispatch(discussionsStart());
  	BaseInstance.performAction({ command, username });
  };
};