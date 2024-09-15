import { useRef, useState } from "react";
import { RootState } from "@store/store";
import { Input } from "@elements/ui/input";
import { Button } from "@elements/ui/button";
import { Switch } from "@elements/ui/switch";
import { useDispatch, useSelector } from "react-redux";
import { logout, set_search_query } from "@store/slice";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@elements/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@elements/ui/popover";
import { ChevronDownIcon, LogOut, MoonIcon, SettingsIcon, SunIcon } from "lucide-react";

export default function Header() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const inputRef = useRef<HTMLInputElement>(null);

	const { user } = useSelector((state: RootState) => state.auth);
	const { searchQuery } = useSelector((state: RootState) => state.app);

	const [isDarkMode, setIsDarkMode] = useState(false);

	if (!user) {
		return;
	}

	function onSearchChange(e: any) {
		dispatch(set_search_query(e.target.value));

		if (location.pathname !== "/files/search") {
			navigate("/files/search");

			if (inputRef && inputRef.current) {
				inputRef.current.focus();
			}
		}
	}

	return (
		<header className="flex items-center justify-end p-4 border-b-2 shadow-md sticky top-0 z-10 bg-background">
			{/* <Input
				placeholder="Search metafiles..."
				value={searchQuery}
				onChange={onSearchChange}
				ref={inputRef}
				className="w-1/3"
			/> */}

			<div className="relative">
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="ghost" className="flex items-center space-x-2">
							<Avatar className="h-8 w-8">
								<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<span className="hidden md:block">
								{user.firstName} {user.lastName} ({user.displayName})
							</span>
							<ChevronDownIcon className="w-5 h-5" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-48 p-2 rounded-md shadow-lg">
						<div className="space-y-2 flex flex-col items-center">
							<Button
								variant="ghost"
								className="flex items-center justify-start w-full"
								onClick={() => navigate("/settings/user/edit")}
							>
								<SettingsIcon className="w-5 h-5 mr-2" />
								<span>Settings</span>
							</Button>
							<Button
								variant="ghost"
								className="flex items-center justify-start  w-full"
								onClick={() => setIsDarkMode(!isDarkMode)}
							>
								{isDarkMode ? (
									<SunIcon className="w-5 h-5 mr-2" />
								) : (
									<MoonIcon className="w-5 h-5 mr-2" />
								)}
								<span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
								<Switch checked={isDarkMode} className="ml-auto hidden" />
							</Button>
							<Button
								variant="ghost"
								className="flex items-center justify-start w-full"
								onClick={() => dispatch(logout())}
							>
								<LogOut className="w-5 h-5 mr-2" />
								<span>Log Out</span>
							</Button>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</header>
	);
}
