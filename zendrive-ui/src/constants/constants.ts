export const APP_NAME = "ZenDrive";

export const BASE_AUTH_URL = import.meta.env.VITE_APP_BASE_AUTH_URL;
export const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;

export class LOCAL_STORAGE {
	static USER_INFO_KEY = "userInfo";
	static ACCESS_TOKEN_KEY = "accessToken";
	static REFRESH_TOKEN_KEY = "refreshToken";
	static DETAILS_EXPANDED_KEY = "detailsExpanded";
	static RECET_FILES_KEY = "recentFiles";
}
