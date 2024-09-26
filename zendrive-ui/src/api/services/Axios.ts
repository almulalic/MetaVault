import { AuthService } from ".";
import axios, { Axios, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getLocalStorageItem } from "@utils/utils";
import { BASE_API_URL, LOCAL_STORAGE_KEYS } from "@constants/constants";
import { ErrorResponse } from "@apiModels/ErrorResponse";
import { ApiResponse } from "@apiModels/ApiResponse";

export const publicAxiosApp = axios.create({
	baseURL: BASE_API_URL,
	timeout: 1000000,
	validateStatus: () => true
});
// attachErrorInterceptorLogic(publicAxiosApp);

export const authorizedAxiosApp = axios.create({
	baseURL: BASE_API_URL,
	timeout: 100000
});
attachTokenLogic(authorizedAxiosApp);
attachRefreshLogic(authorizedAxiosApp);

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
		async function (error: AxiosError) {
			if (!error || !error.response) {
				return;
			}

			const originalRequest = error.config;

			if (!originalRequest) {
				return;
			}

			if (error.response.status === 401 || error.response.status === 403) {
				if (error.response.data == "JWT Expired!") {
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
				return Promise.reject(error.response.data);
			}
		}
	);
}
