import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
	discussions: null,
	loading: true,
	error: null,
};

const discussionsStart = (state, action) => {
	return updateObject(state, {
		discussions: null,
		loading: true,
		error: null,
	});
};

const discussionsSuccess = (state, action) => {
	if (action.discussions && action.discussions !== undefined) {
		return updateObject(state, {
			discussions: action.discussions,
			loading: false,
			error: null,
		});
	}
	return state;
};

const discussionsAdd = (state, action) => {
	if (action.discussion && action.discussion !== undefined) {
		const oldDiscussions = state.discussions && state.discussions;
		const check = oldDiscussions.filter((discussion) => {
			return discussion.name === action.discussion.name && discussion
		});
		if (check.length <= 0) {
			return updateObject(state, {
				discussions: [action.discussion, ...state.discussions],
			});
		}
	}
	return state;
};

const discussionsRemove = (state, action) => {
	if (action.discussion && action.discussion !== undefined) {
		const oldDiscussions = state.discussions !== null && state.discussions;
		const discussions =
			action.discussion === "all"
				? []
				: oldDiscussions.filter((discussion) => {
						return (
							discussion.name !== action.discussion && discussion
						);
				  });
		return updateObject(state, { discussions });
	}
	return state;
};

const discussionsUpdate = (state, action) => {
	if (action.chat_name && action.chat_name !== undefined) {
		const discussions = [...state.discussions];
		let discussion = discussions.filter((discussion) => {
			return discussion.name === action.chat_name && discussion;
		})[0];
		const index = discussions.indexOf(discussion);
		if (discussion !== undefined) {
			if (action.count !== "accept") {
				discussion.user_info.unread_count = action.count;
			} else {
				discussion.user_info.is_friend = true;
				discussion.user_info.frnd_request = null;
			}
			discussions["index"] = discussion;
		}
		return updateObject(state, { discussions });
	}
	return state;
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.DISCUSSIONS_START:
			return discussionsStart(state, action);
		case actionTypes.DISCUSSIONS_SUCCESS:
			return discussionsSuccess(state, action);
		case actionTypes.DISCUSSIONS_ADD:
			return discussionsAdd(state, action);
		case actionTypes.DISCUSSIONS_UPDATE:
			return discussionsUpdate(state, action);
		case actionTypes.DISCUSSIONS_REMOVE:
			return discussionsRemove(state, action);
		default:
			return state;
	}
};

export default reducer;
