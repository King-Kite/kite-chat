import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
import WebSocketInstance from "../../websocket";

const initialState = {
	name: null,
	username: null,
	messages: null,
	newMessage: null,
	recipient: null,
	disabled: true,
	mLoading: true,
	rLoading: true,
};

const chatStart = (state, action) => {
	if (action.name !== null && action.name !== undefined) {
		return updateObject(state, {
			name: action.name,
			username: action.username,
			messages: [],
			newMessage: null,
			recipient: null,
			disabled: true,
			mLoading: true,
			rLoading: true,
		});
	}
	return state;
};

const chatStop = (state, action) => {
	return updateObject(state, {
		name: null,
		username: null,
		messages: null,
		newMessage: null,
		recipient: null,
		disabled: true,
		mLoading: false,
		rLoading: false,
	});
};

const chatFail = (state, action) => {
	return updateObject(state, {
		mLoading: true,
		rLoading: true,
	});
};

const chatHide = (state, action) => {
	if (state.name === action.chat_name || action.chat_name === "all") {
		return updateObject(state, {
			name: null,
			username: null,
			messages: null,
			newMessage: null,
			recipient: null,
			disabled: true,
			mLoading: false,
			rLoading: false,
		});
	}
	return state;
};

const chatCreate = (state, action) => {
	return state;
}

const chatCreated = (state, action) => {
	return state;
}

const chatBlockRecipient = (state, action) => {
	const recipient = { ...state.recipient };
	recipient.user_info.blocked = true;
	return updateObject(state, { recipient, disabled: true });
};

const chatUnblockRecipient = (state, action) => {
	const recipient = { ...state.recipient };
	recipient.user_info.blocked = false;
	return updateObject(state, { recipient, disabled: false });
};

const chatHandleRequest = (state, action) => {
	return state;
};

const chatAcceptRequest = (state, action) => {
	const disabled = false;
	const recipient = { ...state.recipient };
	if (recipient.user_info !== undefined && recipient.user_info.username === action.friend) {
		recipient.user_info.blocked = false;
		recipient.user_info.is_friend = true;
		return updateObject(state, { recipient, disabled });
	}
	return state;
};

const chatDeleteRequest = (state, action) => {
	if (state.name === action.chat_name) {
		return chatStop(state, action);
	}
	return state;
};

const chatMessagesStart = (state, action) => {
	return updateObject(state, {
		messages: null,
		newMessage: null,
		mLoading: true,
	});
};

const chatMessagesSuccess = (state, action) => {
	return updateObject(state, {
		messages: action.messages,
		mLoading: false,
	});
};

const chatMessagesAdd = (state, action) => {
	if (state.recipient.user_info.blocked === true) {
		return state;
	} else {
		return updateObject(state, {
			messages: [...state.messages, action.message],
		});
	}
};

const chatMessageSend = (state, action) => {
	return updateObject(state, {
		newMessage: action.message,
	});
};

const chatClearHistory = (state, action) => {
	return updateObject(state, {
		messages: [],
	});
};

const chatRecipientStart = (state, action) => {
	return updateObject(state, {
		recipient: null,
		rLoading: true,
		disabled: true,
	});
};

const chatRecipientSuccess = (state, action) => {
	const recipient = action.recipient;
	const disabled =
		recipient.user_info.blocked === true ||
		recipient.user_info.is_friend === false
			? true
			: false;
	return updateObject(state, {
		recipient,
		rLoading: false,
		disabled,
	});
};

const chatRecipientDelete = (state, action) => {
	return updateObject(state, {
		recipient: null,
		rLoading: true,
	});
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.CHAT_START:
			return chatStart(state, action);
		case actionTypes.CHAT_STOP:
			return chatStop(state, action);
		case actionTypes.CHAT_FAIL:
			return chatFail(state, action);
		case actionTypes.CHAT_CREATE:
			return chatCreate(state, action);
		case actionTypes.CHAT_CREATED:
			return chatCreated(state, action);
		case actionTypes.CHAT_BLOCK_RECIPIENT:
			return chatBlockRecipient(state, action);
		case actionTypes.CHAT_UNBLOCK_RECIPIENT:
			return chatUnblockRecipient(state, action);
		case actionTypes.CHAT_MESSAGES_START:
			return chatMessagesStart(state, action);
		case actionTypes.CHAT_MESSAGES_SUCCESS:
			return chatMessagesSuccess(state, action);
		case actionTypes.CHAT_MESSAGE_SEND:
			return chatMessageSend(state, action);
		case actionTypes.CHAT_MESSAGES_ADD:
			return chatMessagesAdd(state, action);
		case actionTypes.CHAT_CLEAR_HISTORY:
			return chatClearHistory(state, action);
		case actionTypes.CHAT_HANDLE_REQUEST:
			return chatHandleRequest(state, action);
		case actionTypes.CHAT_ACCEPT_REQUEST:
			return chatAcceptRequest(state, action);
		case actionTypes.CHAT_DELETE_REQUEST:
			return chatDeleteRequest(state, action);
		case actionTypes.CHAT_HIDE:
			return chatHide(state, action);
		case actionTypes.CHAT_RECIPIENT_START:
			return chatRecipientStart(state, action);
		case actionTypes.CHAT_RECIPIENT_SUCCESS:
			return chatRecipientSuccess(state, action);
		case actionTypes.CHAT_RECIPIENT_DELETE:
			return chatRecipientDelete(state, action);
		default:
			return state;
	}
};

export default reducer;
