import { AuthType } from "./AuthType";
import { Role } from "./Role";
import { UserFavoriteView } from "@apiModels/userFavorite/UserFavoriteView";

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
	favorites: UserFavoriteView[];
};
