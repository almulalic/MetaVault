import { LoginFormData } from "@pages/Login";
import { UserInfo } from "@apiModels/UserInfo";
import { LOCAL_STORAGE } from "@constants/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getLocalStorageItem, getParsedLocalStorageItem } from "@utils/utils";
import { GenerateTokenResponse } from "@apiModels/auth/dto/GenerateTokenResponse";

export interface AuthSliceState {
	isLoading: boolean;
	userInfo: UserInfo | null;
	isLoggedIn: boolean;
	accessToken: string | null;
	refreshToken: string | null;
	error: any;
	success: boolean;
	loginData: LoginFormData;
}

const { USER_INFO_KEY, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = LOCAL_STORAGE;

const initialState: AuthSliceState = {
	isLoading: false,
	userInfo: getParsedLocalStorageItem<UserInfo>(USER_INFO_KEY),
	isLoggedIn: !!getLocalStorageItem(USER_INFO_KEY),
	accessToken: getLocalStorageItem(ACCESS_TOKEN_KEY),
	refreshToken: getLocalStorageItem(REFRESH_TOKEN_KEY),
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
		login_attempt: (state: AuthSliceState) => {
			state.isLoading = true;
		},
		login_failed: (state: AuthSliceState) => {
			state.isLoading = false;
		},
		login_sucessfull: (state: AuthSliceState, data: PayloadAction<GenerateTokenResponse>) => {
			state.isLoading = false;
			state.isLoggedIn = true;
			state.userInfo = data.payload.user;
			state.accessToken = data.payload.accessToken;
			state.refreshToken = data.payload.refreshToken;
			localStorage.setItem(ACCESS_TOKEN_KEY, state.accessToken!);
			localStorage.setItem(REFRESH_TOKEN_KEY, state.refreshToken!);
			localStorage.setItem(USER_INFO_KEY, JSON.stringify(data.payload.user));
		},
		logout: (state: AuthSliceState) => {
			localStorage.removeItem(ACCESS_TOKEN_KEY);
			localStorage.removeItem(REFRESH_TOKEN_KEY);
			localStorage.removeItem(USER_INFO_KEY);
			state.isLoading = false;
			state.isLoggedIn = false;
			state.userInfo = null;
			state.accessToken = null;
			state.error = null;
			window.location.reload();
		}
	}
});

export const { login_attempt, login_failed, login_sucessfull, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
