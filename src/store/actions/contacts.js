import * as actionTypes from "./actionTypes";
import { BaseInstance } from "../../websocket";

const command = "get_user_contacts";
const add_command = "new_contact";
const remove_command = "remove_contact";

export const contactsStart = () => {
  return {
  	type: actionTypes.CONTACTS_START
  };
};

export const contactsSuccess = (contacts) => {
  return {
  	type: actionTypes.CONTACTS_SUCCESS,
  	contacts,
  };
};

export const contactsAdd = (contact) => {
  return {
    type: actionTypes.CONTACTS_ADD,
    contact,
  };
};

export const contactsRemove = (contact) => {
  return {
    type: actionTypes.CONTACTS_REMOVE,
    contact,
  };
};

const myContacts = (dispatch) => (contacts) => {
  dispatch(contactsSuccess(contacts.reverse()));
  return BaseInstance.removeCallback(command);
};

const addContacts = (dispatch) => (contact) => {
  return dispatch(contactsAdd(contact));
};

const removeContacts = (dispatch) => (contact) => {
  return dispatch(contactsRemove(contact));
}

export const getContacts = (username) => {
  return (dispatch) => {
    BaseInstance.addCallback(command, myContacts(dispatch));
    BaseInstance.addCallback(add_command, addContacts(dispatch));
    BaseInstance.addCallback(remove_command, removeContacts(dispatch));
  	dispatch(contactsStart());
  	BaseInstance.performAction({ command, username });
  };
};
