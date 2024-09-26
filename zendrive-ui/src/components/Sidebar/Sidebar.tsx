import { cn } from "@utils/utils";
import { useNavigate } from "react-router-dom";
import { Separator } from "@elements/ui/separator";
import TasksSection from "./components/TasksSection";
import AllTasksIcon from "@assets/icons/AllTasksIcon";
import FavoritesSection from "./components/FavoritesSection";
import { ButtonWithIcon } from "@elements/ButtonWithIcon/ButtonWithIcon";
import {
	Settings,
	FolderRoot,
	Share2Icon,
	FolderClock,
	FolderSearch,
	CalendarCheck
} from "lucide-react";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

const SidebarSection = ({ title, children }: any) => {
	return (
		<div className="px-3 py-2">
			<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{title}</h2>
			<div className="space-y-1 px-2">{children}</div>
		</div>
	);
};

export function Sidebar({ className }: SidebarProps) {
	const navigate = useNavigate();

	return (
		<div className={cn("py-6 min-h-full border-r-2 shadow-sm shadow-slate-500", className)}>
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
						<ButtonWithIcon
							icon={<FolderSearch />}
							label="Search"
							onClick={() => navigate("/files/search")}
						/>
						<ButtonWithIcon
							icon={<FolderClock />}
							label="Recet files"
							onClick={() => navigate("/files/recent")}
						/>
						<ButtonWithIcon icon={<Share2Icon />} label="Shared with me" />
					</>
				</SidebarSection>

				<SidebarSection title="Tasks">
					<>
						<ButtonWithIcon
							icon={<AllTasksIcon />}
							label="All Tasks"
							onClick={() => navigate("/tasks")}
						/>

						<ButtonWithIcon
							icon={<CalendarCheck />}
							label="Recurring Tasks"
							onClick={() => navigate("/tasks/recurring")}
						/>

						<Separator className="m-2" />

						<TasksSection />
					</>
				</SidebarSection>

				<SidebarSection title="Favorites">
					<FavoritesSection />
				</SidebarSection>

				<SidebarSection title="Pages">
					<>
						<ButtonWithIcon
							icon={<Settings />}
							label="Settings"
							onClick={() => navigate("/settings")}
						/>
					</>
				</SidebarSection>
			</div>
		</div>
	);
}
