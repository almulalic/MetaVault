import { ReactNode } from "react";
import Header from "@elements/Header/Header";
import { Sidebar } from "@components/Sidebar/Sidebar";
import Search from "@components/Search/Search";

export interface PageProps {
	children: ReactNode;
	title: string;
}

export function FilePage({ children }: PageProps) {
	return (
		<div className="flex h-screen">
			<Search />
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
