import { Route, Routes } from "react-router-dom";
import AuthorizedRoute from "./AuthorizedRoute";
import { Login, Overview } from "../pages";

export default function Router() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<AuthorizedRoute title="" permissions={[]}>
						<Overview />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/files"
				element={
					<AuthorizedRoute title="" permissions={[]}>
						<Overview />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/files/file/:fileId"
				element={
					<AuthorizedRoute title="" permissions={[]}>
						<Overview />
					</AuthorizedRoute>
				}
			/>
			<Route
				path="/login"
				element={
					<AuthorizedRoute title="Login" permissions={[]}>
						<Login />
					</AuthorizedRoute>
				}
			/>
		</Routes>
	);
}
