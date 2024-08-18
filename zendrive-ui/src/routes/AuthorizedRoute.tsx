import { Login } from "../pages";
import { ReactElement } from "react";
import { RootState } from "@store/store";
import { useSelector } from "react-redux";
import { Role } from "src/api/models/auth/Role";
import { APP_NAME } from "../constants/constants";

interface ICustomRouteProps {
	permissions: Role[];
	title: string;
	children: ReactElement;
}

export default function AuthorizedRoute({ permissions, title, children }: ICustomRouteProps) {
	const { userInfo } = useSelector((state: RootState) => state.auth);

	if (
		permissions.length !== 0 &&
		userInfo?.assignedRoles.every((x: Role) => !permissions.includes(x))
	) {
		return <Login />;
	}

	if (title) {
		document.title = `${APP_NAME} | ${title}`;
	}

	return children;
}
