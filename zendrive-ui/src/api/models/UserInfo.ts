import { AuthType } from "./auth/AuthType";
import { Role } from "./auth/Role";
import { UserFavorite } from "./userFavorite/UserFavorite";

export type UserInfo = {
	id: string;
	assignedRoles: Role[];
	authType: AuthType;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	displayName: string;
	creationDate: string;
	enabled: boolean;
	accountNonExpired: boolean;
	accountNonLocked: boolean;
	credentialsNonExpired: boolean;
	authorities: { authority: string }[];
	favorites: UserFavorite[];
};
