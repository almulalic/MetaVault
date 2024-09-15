import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import Header from "@elements/Header/Header";

export interface SettingsPageProps {
	children: ReactNode;
}

export function SettingsPage({ children }: SettingsPageProps) {
	return (
		<div className="flex h-screen">
			<div className="w-1/6 h-full">
				<Sidebar />
			</div>
			<div className="w-5/6 h-full overflow-auto">
				<Header />
				<div className="p-12 flex flex-col justify-start overflow-y-auto">{children}</div>
			</div>
		</div>
	);
}
