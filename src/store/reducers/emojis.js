import * as actionTypes from "../actions/actionTypes";
import { updateObject } from '../utility';

const initialState = {
	emojis: null,
	keys: null,
	error: null,
}

const emojiStart = (state, action) => {
	return state
}

const emojiFail = (state, action) => {
	return updateObject(state, {
		error: action.error,
	})
}

const emojiSuccess = (state, action) => {
	const emojis = action.emojis;
	const keys = [];
	const error = null;
	if (emojis !== null && emojis !== undefined) {
		for (let i in emojis) {
			keys.push(i)
		}
		return updateObject(state, {
			emojis, keys, error,
		})
	}
	return state
}

const reducer = (state=initialState, action) => {
	switch (action.type) {
		case actionTypes.EMOJIS_START: 
			return emojiStart(state, action)
		case actionTypes.EMOJIS_SUCCESS: 
			return emojiSuccess(state, action)
		case actionTypes.EMOJIS_FAIL: 
			return emojiFail(state, action)
		default:
			return state;
	}
}

export default reducer;
