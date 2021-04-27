import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
	notifications: null,
	loading: true,
	error: null,
};

const notificationsStart = (state, action) => {
	return updateObject(state, {
		notifications: null,
		loading: true,
		error: null,
	});
};

const notificationsSuccess = (state, action) => {
	if (action.notifications && action.notifications !== undefined) {
		return updateObject(state, {
			notifications: action.notifications,
			loading: false,
			error: null,
		});
	}
	return state;
};

const notificationsAdd = (state, action) => {
	if (action.notification && action.notification !== undefined) {
		return updateObject(state, {
			notifications: [action.notification, ...state.notifications]
		})
	}
	return state;
}

const notificationsSeen = (state, action) => {
	if (action.chat_name && action.chat_name !== undefined) {
		const oldNotifications = state.notifications !== null && state.notifications
		const notifications = oldNotifications.filter((notification) => {
			return notification.chat_name === action.chat_name ?
				notification.seen = true : notification
		})
		return updateObject(state, {notifications})
	}
	return state;
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.NOTIFICATIONS_START:
			return notificationsStart(state, action);
		case actionTypes.NOTIFICATIONS_SUCCESS:
			return notificationsSuccess(state, action);
		case actionTypes.NOTIFICATIONS_ADD:
			return notificationsAdd(state, action);
		case actionTypes.NOTIFICATIONS_SEEN:
			return notificationsSeen(state, action);
		default:
			return state;
	}
};

export default reducer;
