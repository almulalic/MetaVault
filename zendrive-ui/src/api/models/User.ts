import { Role } from "./auth/Role";
import { AuthType } from "./auth/AuthType";

export type User = {
	id: string;
	roles: Role[];
	authType: AuthType;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	displayName: string;
	creationDate: string;
	enabled: boolean;
	locked: boolean;
};
