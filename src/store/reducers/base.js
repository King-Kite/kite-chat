import * as actionTypes from "../actions/actionTypes";
import { updateObject } from '../utility';
import WebSocketInstance from "../../websocket";

const initialState = {
	connected: false,
	username: null,
	loading: true,
}

const baseConnectStart = (state, action) => {
	if (action.username !== null && action.username !== undefined) {
		return updateObject(state, {
			connected: false,
			username: action.username,
			loading: true,
		});
	}
	return state;
}

const baseConnectFail = (state, action) => {
	return updateObject(state, {
		connected: false,
		loading: false,
	})
}

const baseConnected = (state, action) => {
	return updateObject(state, {
		connected: true,
		loading: false,
	})
}

const baseDisconnect = (state, action) => {
	return updateObject(state, {
		connected: false,
		username: null,
		loading: false,
	})
}


const reducer = (state=initialState, action) => {
	switch (action.type) {
		case actionTypes.BASE_CONNECT_START: 
			return baseConnectStart(state, action)
		case actionTypes.BASE_CONNECTED: 
			return baseConnected(state, action)
		case actionTypes.BASE_CONNECT_FAIL: 
			return baseConnectFail(state, action)
		case actionTypes.BASE_DISCONNECT: 
			return baseDisconnect(state, action)
		default:
			return state;
	}
}

export default reducer;
