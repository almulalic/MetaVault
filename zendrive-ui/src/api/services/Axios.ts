import { AuthService } from ".";
import axios, { Axios } from "axios";
import { getLocalStorageItem } from "@utils/utils";
import { BASE_API_URL, LOCAL_STORAGE_KEYS } from "@constants/constants";
import { ErrorResponse } from "@apiModels/ErrorResponse";

export const publicAxiosApp = axios.create({
	baseURL: BASE_API_URL,
	timeout: 1000000,
	validateStatus: () => true
});
// attachErrorInterceptorLogic(publicAxiosApp);

export const authorizedAxiosApp = axios.create({
	baseURL: BASE_API_URL,
	timeout: 100000,
	validateStatus: (status) => status !== 401 && status !== 403
});
attachTokenLogic(authorizedAxiosApp);
attachRefreshLogic(authorizedAxiosApp);
// attachErrorInterceptorLogic(authorizedAxiosApp);

function attachErrorInterceptorLogic(app: Axios) {
	app.interceptors.response.use(
		(response) => {
			return response.data;
		},
		(error) => {
			const errResponse = error.response?.data as ErrorResponse;
			return Promise.reject(errResponse);
		}
	);
}

function attachTokenLogic(app: Axios) {
	app.interceptors.request.use(async (config) => {
		const accessToken = getLocalStorageItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

		if (accessToken) {
			const token = `Bearer ${accessToken}`;
			config.headers!.Authorization = token;
		}

		return config;
	});
}

function attachRefreshLogic(app: Axios) {
	app.interceptors.response.use(
		(response) => {
			return response;
		},
		async function (error) {
			const originalRequest = error.config;
			if (error.response.status === 401 && !originalRequest._retry) {
				if (error.response.data == "JWT Expired!") {
					originalRequest._retry = true;

					let accessToken: string | null = getLocalStorageItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
					let refreshToken: string | null = getLocalStorageItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

					if (accessToken && refreshToken) {
						let refreshResponse = await AuthService.refreshToken(accessToken, refreshToken);

						if (refreshResponse.status === 200) {
							originalRequest.headers[
								"Authorization"
							] = `Bearer ${refreshResponse.data.accessToken}`;
							localStorage.setItem(
								LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
								refreshResponse.data.accessToken
							);

							return axios(originalRequest);
						} else {
							localStorage.clear();
							window.location.reload();
						}
					} else {
						window.location.replace("/login");
					}
				} else {
					window.location.replace("/login");
				}
			} else {
				window.location.replace("/login");
			}

			return Promise.reject(error);
		}
	);
}
