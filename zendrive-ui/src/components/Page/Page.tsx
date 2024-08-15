import React, { ReactNode } from "react";
import { Sidebar } from "@components/ui/sidebar";
import { Menu } from "@components/Menu/Menu";

interface PageProps {
	children: ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
	return (
		<div className="flex flex-col">
			<div className="w-full">
				<Menu />
			</div>
			<div className="flex">
				<div className="w-1/6">
					<Sidebar playlists={[]} />
				</div>
				<div className="w-5/6 px-12 flex flex-col justify-start">{children}</div>
			</div>
		</div>
	);
};

export default Page;
