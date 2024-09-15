import { AuthType } from "@apiModels/auth/AuthType";

export class CreaterUserDto {
	authType: AuthType;
	firstName: string;
	lastName: string;
	email: string;
	displayName: string;
	roles: string[];

	constructor(
		authType: AuthType,
		firstName: string,
		lastName: string,
		email: string,
		displayName: string,
		roles: string[]
	) {
		this.authType = authType;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.displayName = displayName;
		this.roles = roles;
	}
}
