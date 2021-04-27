import * as actionTypes from "../actions/actionTypes";
import { updateObject } from '../utility';

const initialState = {
	myInfo: {},
	error: null,
}

const myInfoStart = (state, action) => {
	return updateObject(state, {
		myInfo: {},
		error: null
	});
}

const myInfoSuccess = (state, action) => {
	if (action.myInfo && action.myInfo !== undefined) {
		return updateObject(state, {
			myInfo: action.myInfo,
			error: null
		})
	}
}

const myInfoFail = (state, action) => {
	return updateObject(state, {
		error: action.error,
	})
}

const myInfoUpdate = (state, action) => {
	if (action.info && action.info !== undefined) {
		return updateObject(state, {
			myInfo: action.info,
			error: null
		})
	}
	return state;
}

const reducer = (state=initialState, action) => {
	switch (action.type) {
		case actionTypes.MY_INFO_START: 
			return myInfoStart(state, action)
		case actionTypes.MY_INFO_SUCCESS: 
			return myInfoSuccess(state, action)
		case actionTypes.MY_INFO_UPDATE:
			return myInfoUpdate(state, action)
		case actionTypes.MY_INFO_FAIL:
			return myInfoFail(state, action)
		default:
			return state;
	}
}

export default reducer;
