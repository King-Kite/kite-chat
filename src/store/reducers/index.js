import { combineReducers } from 'redux';
import auth from "./auth";
import base from "./base";
import chat from "./chat";
import contacts from "./contacts";
import discussions from "./discussions";
import emojis from "./emojis";
import info from "./myInfo";
import notifications from "./notifications";

export default combineReducers({
  auth,
  base,
  chat,
  contacts,
  discussions,
  emojis,
  info,
  notifications,
})