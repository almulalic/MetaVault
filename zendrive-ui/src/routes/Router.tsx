import { Route, Routes } from "react-router-dom";
import AuthorizedRoute from "./AuthorizedRoute";
import { Login, Overview } from "../pages";
import SettingsPage from "@pages/SettingsPage/SettingsPage";
import RecentFiles from "@pages/RecentFiles/RecentFiles";

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
				path="/files/tree"
				element={
					<AuthorizedRoute title="" permissions={[]}>
						<Overview />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/files/tree/:fileId"
				element={
					<AuthorizedRoute title="" permissions={[]}>
						<Overview />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/files/recent"
				element={
					<AuthorizedRoute title="" permissions={[]}>
						<RecentFiles />
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

			<Route
				path="/settings"
				element={
					<AuthorizedRoute title="Settings" permissions={[]}>
						<SettingsPage />
					</AuthorizedRoute>
				}
			/>
		</Routes>
	);
}
