import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
	contacts: null,
	error: null,
	r_error: null,
	success: null,
	loading: true,
	sender: null,
	recipient: null,
	rLoading: false,
	cInfo: null,
};

const contactsStart = (state, action) => {
	return updateObject(state, {
		contacts: null,
		error: null,
		r_error: null,
		success: null,
		loading: true,
		sender: null,
		recipient: null,
		rLoading: false,
		cInfo: null,
	});
};

const contactsSuccess = (state, action) => {
	if (action.contacts && action.contacts !== undefined) {
		return updateObject(state, {
			contacts: action.contacts,
			loading: false,
		});
	}
};

const contactsAdd = (state, action) => {
	if (action.contact && action.contact !== undefined) {
		return updateObject(state, {
			contacts: [action.contact, ...state.contacts],
		});
	}
};

const contactsRemove = (state, action) => {
	if (action.contact && action.contact !== undefined) {
		const oldContacts = state.contacts !== null && state.contacts;
		const contacts = oldContacts.filter(
			(contact) => contact.user_info.username !== action.contact
		);
		return updateObject(state, { contacts });
	}
};

const requestStart = (state, action) => {
	const { sender, recipient } = action;
	const rLoading = true;
	if (sender && recipient) {
		return updateObject(state, { sender, recipient, rLoading });
	}
	return state;
};

const requestSuccess = (state, action) => {
	if (action.success) {
		return updateObject(state, {
			success: action.success,
			error: null,
			r_error: null,
			rLoading: false,
		});
	}
	return state;
};

const requestFail = (state, action) => {
	if (action.error) {
		return updateObject(state, {
			success: null,
			r_error: action.error,
			rLoading: false,
		});
	}
	return state;
};

const contactInfo = (state, action) => {
	if (
		action.contact &&
		action.contact.user_info !== undefined &&
		action.contact.user_info !== undefined
	) {
		return updateObject(state, {
			cInfo: action.contact.user_info,
			recipient: action.contact.recipient,
			error: null,
		});
	} else {
		return updateObject(state, {
			cInfo: null,
			recipient: action.contact.recipient,
			error: action.contact.error
				? action.contact.error
				: "No Contact with specified Username!",
		});
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.CONTACTS_START:
			return contactsStart(state, action);
		case actionTypes.CONTACTS_SUCCESS:
			return contactsSuccess(state, action);
		case actionTypes.CONTACTS_ADD:
			return contactsAdd(state, action);
		case actionTypes.CONTACTS_REMOVE:
			return contactsRemove(state, action);
		case actionTypes.CONTACTS_REQUEST_START:
			return requestStart(state, action);
		case actionTypes.CONTACTS_REQUEST_SUCCESS:
			return requestSuccess(state, action);
		case actionTypes.CONTACTS_REQUEST_FAIL:
			return requestFail(state, action);
		case actionTypes.CONTACTS_INFO_CONTACT:
			return contactInfo(state, action);
		default:
			return state;
	}
};

export default reducer;
