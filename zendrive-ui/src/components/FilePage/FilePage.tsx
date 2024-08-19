import { ReactNode } from "react";
import { Menu } from "@components/Menu/Menu";
import { Sidebar } from "@components/Sidebar/Sidebar";

export interface PageProps {
	children: ReactNode;
	title: string;
}

export function FilePage({ children, title }: PageProps) {
	return (
		<div className="flex flex-col">
			<div className="w-full">
				<Menu />
			</div>
			<div className="flex">
				<div className="w-1/6">
					<Sidebar />
				</div>
				<div className="w-5/6 px-12 flex flex-col justify-start">{children}</div>
			</div>
		</div>
	);
}
