import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger
} from "@elements/ui/context-menu";
import { AxiosResponse } from "axios";
import { RootState } from "@store/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@elements/ui/skeleton";
import { ScrollArea } from "@elements/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { FileTextIcon, FolderIcon } from "lucide-react";
import { set_user_favorites } from "@store/slice/userSlice";
import { MetafileView } from "@apiModels/metafile/MetafileView";
import { UserFavoriteService } from "@services/UserFavoriteService";
import { UserFavoriteView } from "@apiModels/userFavorite/UserFavoriteView";

export default function FavoritesSection() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { favorites } = useSelector((state: RootState) => state.user);
	const [favoritesLoading, setFavoritesLoading] = useState(true);

	useEffect(() => {
		async function getFavorites() {
			setFavoritesLoading(true);

			const response: AxiosResponse<UserFavoriteView[]> = await UserFavoriteService.getAll();

			if (response.status === 200) {
				dispatch(set_user_favorites(response.data));
				setFavoritesLoading(false);
			}
		}

		getFavorites();
	}, [favorites.length]);

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
		<ScrollArea className="px-2">
			{favoritesLoading
				? [0, 1, 2].map((x) => (
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
	);
}
