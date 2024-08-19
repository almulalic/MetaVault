import Sidebar from "./components/Sidebar";

export interface SettingsPageProps {}

export default function SettingsPage() {
	return (
		<div className="flex flex-col">
			<div className="flex">
				<div className="w-1/6">
					<Sidebar />
				</div>
				<div className="w-5/6 px-12 flex flex-col justify-start">a</div>
			</div>
		</div>
	);
}
