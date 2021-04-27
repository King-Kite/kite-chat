import * as actionTypes from "./actionTypes";
import { emojiFetchUrl } from "../../constants";

export const EmojiStart = () => {
  return {
    type: actionTypes.EMOJIS_START,
  };
};

export const EmojiSuccess = (emojis) => {
  return {
    type: actionTypes.EMOJIS_SUCCESS,
    emojis
  };
};

export const EmojiFail = (error) => {
  return {
    type: actionTypes.EMOJIS_FAIL,
    error,
  };
};

const saveEmojis = (emojis, dispatch) => {
  localStorage.setItem("emojis", JSON.stringify(emojis));
  dispatch(EmojiSuccess(JSON.stringify(emojis)));
};

const getEmojis = (dispatch) => {
  fetch(emojiFetchUrl, {method: "get"})
  .then((response) => response.json())
  .then((data) => {
    saveEmojis(data, dispatch);
  })
  .catch((error) => dispatch(EmojiFail(error)));
}

export const loadEmojis = () => {
  return (dispatch) => {
    dispatch(EmojiStart());
    const emojis = localStorage.getItem("emojis");
    if (emojis === null || emojis === undefined) {
      getEmojis(dispatch);
    } else {
      dispatch(EmojiSuccess(JSON.parse(emojis)));
    }
  };
};
