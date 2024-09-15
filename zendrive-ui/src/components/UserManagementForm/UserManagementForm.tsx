import { AxiosResponse } from "axios";
import { User } from "@apiModels/User";
import { useEffect, useState } from "react";
import { toast } from "@elements/ui/use-toast";
import { Combobox } from "@elements/ui/combobox";
import { AdminService } from "@services/AdminService";
import { SettingsPage } from "@pages/Settings/Settings";
import { ManagerUserFormValues, ManageUserCard } from "./components/ManageUserCard";
import { EditUserDto } from "@apiModels/auth/dto/EditUserDto";
import { Card, CardContent, CardHeader, CardTitle } from "@elements/ui/card";

export default function UserManagementForm() {
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [query, setQuery] = useState<string>("");

	async function getUsers(query: string) {
		const response: AxiosResponse<User[]> = await AdminService.searchUser(query);

		if (response.status === 200) {
			setUsers(response.data);
		}
	}

	async function onSave(user: User, values: ManagerUserFormValues) {
		const response: AxiosResponse<User> = await AdminService.editUser(
			new EditUserDto(user.id, values.roles, values.enabled, values.locked)
		);

		if (response.status === 200) {
			toast({
				title: `User (${user.displayName}) ${user.email} sucessfully edited.`
			});
		}
	}

	useEffect(() => {
		getUsers(query);
	}, [query]);

	return (
		<SettingsPage>
			<Card className="flex flex-col justify-start gap-8 w-[50%]">
				<CardHeader>
					<CardTitle>Users Management</CardTitle>
				</CardHeader>

				<CardContent>
					<div className="w-full">
						<Combobox
							popoverButtonClassName="w-lg"
							popoverClassName="w-lg"
							items={users.map((x) => ({ label: x.email, value: x.id }))}
							placeholder="Search users by name, email, username..."
							emptyMessage="No users with that query were found."
							onSearchChange={(value) => setQuery(value)}
							onChange={(value) => setSelectedUser(users.filter((x) => x.id === value)[0])}
						/>
					</div>

					{selectedUser && <ManageUserCard user={selectedUser} onSave={onSave} />}
				</CardContent>
			</Card>
		</SettingsPage>
	);
}
