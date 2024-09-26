import Tasks from "@pages/Tasks/Tasks";
import { Login, Overview } from "../pages";
import AuthorizedRoute from "./AuthorizedRoute";
import { Route, Routes } from "react-router-dom";
import RecentFiles from "@pages/RecentFiles/RecentFiles";
import TaskOverview from "@pages/TaskOverview/TaskOverview";
import { EditUserForm } from "@components/EditUserForm/EditUserForm";
import UserManagementForm from "@components/UserManagementForm/UserManagementForm";
import AddUserForm from "@components/AddUserForm/AddUserForm";
import SearchFiles from "@pages/SearchFiles/SearchFiles";
import RecurringTasks from "@pages/RecurringTasks/RecurringTasks";

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
				path="/settings"
				element={
					<AuthorizedRoute title="Settings" permissions={[]}>
						<EditUserForm />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/settings/user/edit"
				element={
					<AuthorizedRoute title="Edit Profile" permissions={[]}>
						<EditUserForm />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/settings/users/manage"
				element={
					<AuthorizedRoute title="Manage Users" permissions={[]}>
						<UserManagementForm />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/settings/users/add"
				element={
					<AuthorizedRoute title="Add User" permissions={[]}>
						<AddUserForm />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/files/tree"
				element={
					<AuthorizedRoute title="File Tree" permissions={[]}>
						<Overview />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/files/search"
				element={
					<AuthorizedRoute title="Search Files" permissions={[]}>
						<SearchFiles />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/files/tree/:fileId"
				element={
					<AuthorizedRoute title="File" permissions={[]}>
						<Overview />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/files/recent"
				element={
					<AuthorizedRoute title="Recent File" permissions={[]}>
						<RecentFiles />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/tasks"
				element={
					<AuthorizedRoute title="Tasks" permissions={[]}>
						<Tasks />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/tasks/recurring"
				element={
					<AuthorizedRoute title="Recurring Tasks" permissions={[]}>
						<RecurringTasks />
					</AuthorizedRoute>
				}
			/>

			<Route
				path="/tasks/:taskId"
				element={
					<AuthorizedRoute title="Task" permissions={[]}>
						<TaskOverview />
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
