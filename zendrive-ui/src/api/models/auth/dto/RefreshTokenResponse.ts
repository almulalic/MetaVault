import { User } from "@apiModels/User";

export class RefreshTokenResponse {
	user: User;
	accessToken: string;
	refreshToken: string;

	constructor(user: User, accessToken: string, refreshToken: string) {
		this.user = user;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}
}
