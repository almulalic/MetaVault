import { User } from "@apiModels/User";

export class GenerateTokenResponse {
	user: user;
	accessToken: string;
	refreshToken: string | null;

	constructor(user: user, accessToken: string, refreshToken: string | null) {
		this.user = user;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}
}
