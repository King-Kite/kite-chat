const url = "localhost:8000";

export const chatUrl = `ws://${url}/ws`;
export const baseUrl = `http://${url}`;

export const accountChangePasswordUrl = `${baseUrl}/rest-auth/password/change/`;
export const accountLoginUrl = `${baseUrl}/rest-auth/login/`;
export const accountRegistrationUrl = `${baseUrl}/rest-auth/registration/`;
export const accountSettingsUrl = `${baseUrl}/api/users/settings/account`;

export const createMessageUrl = `${baseUrl}/api/chats/create/message/`;

export const emojiFetchUrl = `${baseUrl}/emoji/all.json`;

export const loadingDiv = (
	<div
		className="loading"
		style={{
			display: "block",
		}}
	/>
);

export default baseUrl;
