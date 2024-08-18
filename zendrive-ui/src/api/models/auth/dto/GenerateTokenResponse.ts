import { UserInfo } from "@apiModels/UserInfo";

export class GenerateTokenResponse {
	user: UserInfo;
	accessToken: string;
	refreshToken: string | null;

	constructor(user: UserInfo, accessToken: string, refreshToken: string | null) {
		this.user = user;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}
}
