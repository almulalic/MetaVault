import { AxiosResponse } from "axios";
import { authorizedAxiosApp, publicAxiosApp } from "./Axios";
import { createSearchParams } from "react-router-dom";
import { GenerateTokenResponse } from "@apiModels/auth/dto/GenerateTokenResponse";
import { RefreshTokenResponse } from "@apiModels/auth/dto/RefreshTokenResponse";

export class AuthService {
	static async login(
		email: string,
		password: string,
		rememberMe: boolean
	): Promise<AxiosResponse<GenerateTokenResponse>> {
		return publicAxiosApp.post("/auth/token/generate", {
			email: email,
			password: password,
			rememberMe: rememberMe
		});
	}

	static async refreshToken(
		accessToken: string,
		refreshToken: string
	): Promise<AxiosResponse<RefreshTokenResponse>> {
		return publicAxiosApp.post("/auth/token/refresh", {
			accessToken: accessToken,
			refreshToken: refreshToken
		});
	}

	static async signup(
		firstName: string,
		lastName: string,
		displayName: string,
		email: string,
		password: string
	): Promise<AxiosResponse> {
		return publicAxiosApp.post("/auth/signup", {
			firstName: firstName,
			lastName: lastName,
			email: email,
			displayName: displayName,
			password: password
		});
	}

	static async getUsers(searchText: string): Promise<AxiosResponse> {
		return authorizedAxiosApp.get(
			`/auth/user/search?${createSearchParams({
				searchText: searchText
			})}`
		);
	}

	static async changeRoles(userId: string, roles: string[]): Promise<AxiosResponse> {
		return authorizedAxiosApp.put(`/auth/user/edit/role`, {
			userId: userId,
			roles: roles
		});
	}
}
