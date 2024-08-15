import { createSlice } from "@reduxjs/toolkit";
import { LoginFormData } from "../pages/Login/Login";
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from "../constants";
import { UserInfo } from "@apiModels/UserInfo";

export interface AuthState {
	isLoading: boolean;
	userInfo: UserInfo | null;
	isLoggedIn: boolean;
	accessToken: string | null;
	refreshToken: string | null;
	error: any;
	success: boolean;
	loginData: LoginFormData;
}

const initialState: AuthState = {
	isLoading: false,
	userInfo: localStorage.getItem("userInfo")
		? JSON.parse(localStorage.getItem("userInfo") || "")
		: null,
	isLoggedIn: localStorage.getItem(ACCESS_TOKEN_NAME) ? true : false,
	accessToken: localStorage.getItem(ACCESS_TOKEN_NAME)
		? localStorage.getItem(ACCESS_TOKEN_NAME)
		: null,
	refreshToken: localStorage.getItem(REFRESH_TOKEN_NAME)
		? localStorage.getItem(REFRESH_TOKEN_NAME)
		: null,
	error: null,
	success: false,
	loginData: {
		email: "",
		password: "",
		rememberMe: false
	}
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login_attempt: (state) => {
			state.isLoading = true;
		},
		login_failed: (state) => {
			state.isLoading = false;
		},
		login_sucessfull: (state, data) => {
			console.log(data.payload);
			state.isLoading = false;
			state.isLoggedIn = true;
			state.userInfo = data.payload.user;
			state.accessToken = data.payload[ACCESS_TOKEN_NAME];
			state.refreshToken = data.payload[REFRESH_TOKEN_NAME];
			localStorage.setItem(ACCESS_TOKEN_NAME, state.accessToken!);
			localStorage.setItem(REFRESH_TOKEN_NAME, state.refreshToken!);
			localStorage.setItem("userInfo", JSON.stringify(data.payload.user));
		},
		set_user_favorites: (state, data) => {
			if (state.userInfo) {
				state.userInfo.favorites = data.payload;
			}
		},
		logout: (state) => {
			localStorage.removeItem(ACCESS_TOKEN_NAME);
			localStorage.removeItem(REFRESH_TOKEN_NAME);
			localStorage.removeItem("userInfo");
			state.isLoading = false;
			state.isLoggedIn = false;
			state.userInfo = null;
			state.accessToken = null;
			state.error = null;
			window.location.reload();
		}
	}
});

export const { login_attempt, login_failed, login_sucessfull, set_user_favorites, logout } =
	authSlice.actions;
export default authSlice.reducer;
