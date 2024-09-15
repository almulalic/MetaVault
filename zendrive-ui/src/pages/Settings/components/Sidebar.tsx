import { cn } from "@utils/utils";
import { useNavigate } from "react-router-dom";
import { FolderRoot, User, UserPlus, Users } from "lucide-react";
import { ButtonWithIcon } from "@elements/ButtonWithIcon/ButtonWithIcon";

const SidebarSection = ({ title, children }: any) => {
	return (
		<div className="px-3 py-2">
			<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{title}</h2>
			<div className="space-y-1 px-2">{children}</div>
		</div>
	);
};

export default function Sidebar() {
	const navigate = useNavigate();

	return (
		<div className={cn("py-6 h-full border-r-2 shadow-sm shadow-slate-500")}>
			<div className="space-y-4 py-4">
				<div className="px-3 py-2" onClick={() => navigate("/")}>
					<h2 className="px-4 text-2xl font-semibold tracking-tight cursor-pointer">ZenDrive</h2>
				</div>

				<SidebarSection title="Files">
					<>
						<ButtonWithIcon
							icon={<FolderRoot />}
							label="All files"
							onClick={() => navigate("/files/tree")}
						/>
					</>
				</SidebarSection>

				<SidebarSection title="User Settings">
					<>
						<ButtonWithIcon
							icon={<User />}
							label="Profile"
							onClick={() => navigate("/settings/user/edit")}
						/>
					</>
				</SidebarSection>

				<SidebarSection title="App Settings">
					<>
						<ButtonWithIcon
							icon={<Users />}
							label="Users management"
							onClick={() => navigate("/settings/users/manage")}
						/>
						<ButtonWithIcon
							icon={<UserPlus />}
							label="Add user"
							onClick={() => navigate("/settings/users/add")}
						/>
					</>
				</SidebarSection>
			</div>
		</div>
	);
}
