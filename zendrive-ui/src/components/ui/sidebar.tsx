import { Button } from "./button";
import { cn } from "@utils/utils";
import { ScrollArea } from "./scroll-area";
import {
	Trash2,
	FolderRoot,
	PlusCircle,
	Share2Icon,
	FolderClock,
	FoldersIcon,
	FolderIcon,
	FileTextIcon
} from "lucide-react";
import { RootState } from "src/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { UserFavoriteService } from "@services/UserFavoriteService";
import { UserFavoriteResponse } from "@apiModels/userFavorite/UserFavoriteResponse";
import { useNavigate } from "react-router-dom";
import React from "react";
import { set_user_favorites } from "../../store/authSlice";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger
} from "./context-menu";
import { AxiosResponse } from "axios";
import { UserFavorite } from "@apiModels/userFavorite/UserFavorite";
import { Skeleton } from "./skeleton";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
	playlists: string[];
}

export function Sidebar({ className }: SidebarProps) {
	const ButtonWithIcon = ({ icon, label }: any) => {
		return (
			<Button variant="ghost" className="w-full flex gap-2 justify-start text-sm">
				{icon}
				{label}
			</Button>
		);
	};

	const { userInfo } = useSelector((state: RootState) => state.auth);

	const [favoritesLoading, setFavoritesLoading] = useState(true);
	const [favorites, setFavorites] = useState<UserFavoriteResponse[]>([]);

	const dispatch = useDispatch();

	useEffect(() => {
		async function getFavorites() {
			setFavoritesLoading(true);

			let response = await UserFavoriteService.getAll();

			if (response.status === 200) {
				setFavorites(response.data);
				dispatch(set_user_favorites(response.data));
				setFavoritesLoading(false);
			}
		}

		getFavorites();
	}, [userInfo?.favorites.length]);

	const navigate = useNavigate();

	async function removeFromFavorites(metafileId: string) {
		const response: AxiosResponse<UserFavorite> = await UserFavoriteService.remove({
			metafileId: metafileId
		});

		if (response.status === 200) {
			dispatch(set_user_favorites(userInfo?.favorites.filter((x) => x.metafile.id !== metafileId)));
		}
	}

	const renderFavorite = (metafile: MetaFile) => {
		return (
			<ContextMenu key={metafile.id}>
				<ContextMenuTrigger>
					<div
						key={metafile.id}
						className="cursor-pointer items-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full flex gap-2 justify-start text-sm"
						onClick={() => {
							navigate(`/files/file/${metafile.id}`);
							window.location.reload();
						}}
					>
						{metafile.children !== null ? (
							<FolderIcon className="h-6 w-6" />
						) : (
							<FileTextIcon className="h-6 w-6" />
						)}
						{metafile.name}
					</div>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onClick={async () => await removeFromFavorites(metafile.id)}>
						Unfavorite
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		);
	};

	return (
		<div className={cn("pb-12", className)}>
			<div className="space-y-4 py-4">
				<div className="px-3 py-2">
					<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Files</h2>
					<div className="space-y-1">
						<ButtonWithIcon icon={<FolderRoot />} label="All files" />
						<ButtonWithIcon icon={<FolderClock />} label="Recet files" />
						<ButtonWithIcon icon={<Share2Icon />} label="Shared with me" />
						<ButtonWithIcon icon={<Trash2 />} label="Trash" />
					</div>
				</div>

				<div className="px-3 py-2">
					<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Favorites</h2>
					<ScrollArea className="h-[300px] px-1">
						{favoritesLoading
							? [0, 1, 2, 3, 4].map((x) => (
									<div
										key={x}
										className="cursor-pointer items-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full flex gap-2 justify-start text-sm"
									>
										<Skeleton className="h-6 w-6 rounded" />
										<Skeleton className="h-4 w-3/4 rounded" />
									</div>
							  ))
							: favorites.map((x) => renderFavorite(x.metafile))}
					</ScrollArea>
				</div>

				<div className="px-3 py-2">
					<div className="mb-2">
						<span className="flex gap-2 justify-start items-center text-sm mb-2 px-4">
							<h2 className="text-lg font-semibold tracking-tight">Projects</h2>
							<PlusCircle size={18} className="cursor-pointer select-none" />
						</span>

						<ButtonWithIcon icon={<FoldersIcon />} label="All projects" />
					</div>

					<hr />

					<ScrollArea className="h-[300px] px-1"></ScrollArea>
				</div>
			</div>
		</div>
	);
}
