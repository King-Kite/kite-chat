import * as actionTypes from "../actions/actionTypes";
import { updateObject } from '../utility';

const initialState = {
	token: null,
	username: null,
	error: null,
	loading: true
}

const authStart = (state, action) => {
	return updateObject(state, {
		error: null,
		loading: true	
	});
}

const authFail = (state, action) => {
	return updateObject(state, {
		error: action.error,
		loading: false	
	})
}

const authSuccess = (state, action) => {
	if (action.token !== null && action.token !== undefined) {
		return updateObject(state, {
			token: action.token,
			username: action.username,
			error: null,
			loading: false	
		})
	} else {
		return authFail(state, action)
	}
}

const authLogout = (state, action) => {
	return updateObject(state, {
		token: null,
		username: null,
		loading: false,
	})
}

const reducer = (state=initialState, action) => {
	switch (action.type) {
		case actionTypes.AUTH_START: 
			return authStart(state, action)
		case actionTypes.AUTH_SUCCESS: 
			return authSuccess(state, action)
		case actionTypes.AUTH_FAIL: 
			return authFail(state, action)
		case actionTypes.AUTH_LOGOUT: 
			return authLogout(state, action)
		default:
			return state;
	}
}

export default reducer;
