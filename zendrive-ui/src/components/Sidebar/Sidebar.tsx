import { Button } from "../../elements/ui/button";
import { cn } from "@utils/utils";
import { ScrollArea } from "../../elements/ui/scroll-area";
import {
	FolderRoot,
	PlusCircle,
	Share2Icon,
	FolderClock,
	FoldersIcon,
	FolderIcon,
	FileTextIcon
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { UserFavoriteService } from "@services/UserFavoriteService";
import { useNavigate } from "react-router-dom";
import React from "react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger
} from "../../elements/ui/context-menu";
import { AxiosResponse } from "axios";
import { UserFavoriteView } from "@apiModels/userFavorite/UserFavoriteView";
import { Skeleton } from "../../elements/ui/skeleton";
import { RootState } from "@store/store";
import { set_user_favorites } from "@store/slice/userSlice";
import { MetafileView } from "@apiModels/metafile/MetafileView";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export function Sidebar({ className }: SidebarProps) {
	const ButtonWithIcon = ({ icon, label, onClick }: any) => {
		return (
			<Button variant="ghost" className="w-full flex gap-2 justify-start text-sm" onClick={onClick}>
				{icon}
				{label}
			</Button>
		);
	};

	const { favorites } = useSelector((state: RootState) => state.user);

	const [favoritesLoading, setFavoritesLoading] = useState(true);

	const dispatch = useDispatch();

	useEffect(() => {
		async function getFavorites() {
			setFavoritesLoading(true);

			let response: AxiosResponse<UserFavoriteView[]> = await UserFavoriteService.getAll();

			if (response.status === 200) {
				dispatch(set_user_favorites(response.data));
				setFavoritesLoading(false);
			}
		}

		getFavorites();
	}, [favorites.length]);

	const navigate = useNavigate();

	async function removeFromFavorites(metafileId: string) {
		const response: AxiosResponse<UserFavoriteView[]> = await UserFavoriteService.remove({
			metafiles: [metafileId]
		});

		if (response.status === 200) {
			dispatch(set_user_favorites(favorites.filter((x) => x.metafileView.id !== metafileId)));
		}
	}

	const renderFavorite = (metafileView: MetafileView) => {
		return (
			<ContextMenu key={metafileView.id}>
				<ContextMenuTrigger>
					<div
						key={metafileView.id}
						className="cursor-pointer items-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full flex gap-2 justify-start text-sm"
						onClick={() => {
							navigate(`/files/tree/${metafileView.id}`);
						}}
					>
						{metafileView.isFolder ? (
							<FolderIcon className="h-6 w-6" />
						) : (
							<FileTextIcon className="h-6 w-6" />
						)}
						{metafileView.name}
					</div>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onClick={async () => await removeFromFavorites(metafileView.id)}>
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
						<ButtonWithIcon
							icon={<FolderRoot />}
							label="All files"
							onClick={() => navigate("/files/tree")}
						/>
						<ButtonWithIcon
							icon={<FolderClock />}
							label="Recet files"
							onClick={() => navigate("/files/recent")}
						/>
						<ButtonWithIcon icon={<Share2Icon />} label="Shared with me" />
					</div>
				</div>

				<div className="px-3 py-2">
					<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Tasks</h2>
					<ScrollArea className="h-[150px] max-h-[150px] px-1">
						{favoritesLoading
							? [0, 1, 2, 3, 4].map((x) => (
									<div
										key={x}
										className="items-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full flex gap-2 justify-start text-sm"
									>
										<Skeleton className="h-6 w-6 rounded" />
										<Skeleton className="h-4 w-3/4 rounded" />
									</div>
							  ))
							: favorites.map((x) => renderFavorite(x.metafileView))}
					</ScrollArea>
				</div>

				<div className="px-3 py-2">
					<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Favorites</h2>
					<ScrollArea className="h-[300px] px-1">
						{favoritesLoading
							? [0, 1, 2, 3, 4].map((x) => (
									<div
										key={x}
										className="items-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full flex gap-2 justify-start text-sm"
									>
										<Skeleton className="h-6 w-6 rounded" />
										<Skeleton className="h-4 w-3/4 rounded" />
									</div>
							  ))
							: favorites.map((x) => renderFavorite(x.metafileView))}
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
