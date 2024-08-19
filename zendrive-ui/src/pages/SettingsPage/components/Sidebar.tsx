import { cn } from "@utils/utils";
import { Users } from "lucide-react";

export default function Sidebar() {
	const SidebarItem = ({ name, children }: any) => {
		return (
			<div className="px-3 py-2">
				<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{name}</h2>
				<div className="space-y-1">{children}</div>
			</div>
		);
	};

	return (
		<div className={cn("pb-12")}>
			<div className="space-y-4 py-4">
				<div>ZenDrive</div>
				<SidebarItem>
					{/* <IconButton onClick={() => {}} /> */}
					<Users /> Users
				</SidebarItem>
				<SidebarItem>b</SidebarItem>
			</div>
		</div>
	);
}
