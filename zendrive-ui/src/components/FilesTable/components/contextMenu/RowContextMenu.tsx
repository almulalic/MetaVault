import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger
} from "@elements/ui/context-menu";
import { UserFavoriteView } from "@apiModels/userFavorite/UserFavoriteView";
import { UserFavoriteService } from "@services/UserFavoriteService";
import { Row } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ReactNode, useState } from "react";
import { DeleteMetafileDialog } from "./DeleteMetafileDialog";
import { FolderSync, Info, Star, StarOff, Trash2 } from "lucide-react";
import { MetaFile } from "@apiModels/metafile";
import { set_user_favorites, set_details_expanded } from "@store/slice/userSlice";
import { RootState } from "@store/store";

export interface RowContextMenuProps {
	rowData: Row<MetaFile>;
	children: ReactNode;
}

export default function RowContextMenu({ rowData, children }: RowContextMenuProps) {
	const dispatch = useDispatch();
	const { favorites } = useSelector((state: RootState) => state.user);
	const { selectedMetafiles } = useSelector((state: RootState) => state.fileTable);

	async function addToFavorites(metafiles: string[]) {
		const response: AxiosResponse<UserFavoriteView[]> = await UserFavoriteService.add({
			metafiles: metafiles
		});

		if (response.status === 200) {
			dispatch(set_user_favorites([...favorites, ...response.data]));
		}
	}

	async function removeFromFavorites(metafiles: string[]) {
		const response: AxiosResponse<UserFavoriteView[]> = await UserFavoriteService.remove({
			metafiles: metafiles
		});

		if (response.status === 200) {
			const deletedIds = response.data.map((x) => x.metafileView.id);

			dispatch(
				set_user_favorites(favorites.filter((x) => !deletedIds.includes(x.metafileView.id)))
			);
		}
	}

	async function handleFavorite() {
		const favoriteIds = favorites.map((x) => x.metafileView.id);

		if (selectedMetafiles.every((x) => favoriteIds.includes(x.id))) {
			removeFromFavorites(selectedMetafiles.map((x) => x.id));
		} else {
			addToFavorites(selectedMetafiles.map((x) => x.id));
		}
	}

	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

	function handleDeleteDialogOpen(open: boolean) {
		setDeleteDialogOpen(open);
	}

	function handleDetailsClick() {
		dispatch(set_details_expanded(true));
	}

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger asChild onClick={(e) => e.preventDefault()}>
					{children}
				</ContextMenuTrigger>

				<ContextMenuContent>
					<ContextMenuItem onClick={handleDetailsClick} className="cursor-pointer">
						<span className="inline-flex justify-center items-center">
							<FolderSync size="16px" className="mr-1" />
							Sync
						</span>
					</ContextMenuItem>
					<ContextMenuItem onClick={handleFavorite} className="cursor-pointer">
						{favorites.some((x) => x.metafileView.id === rowData.original.id) ? (
							<span className="inline-flex justify-center items-center">
								<StarOff size="16px" className="mr-1" /> Unfavorite
							</span>
						) : (
							<span className="inline-flex justify-center items-center">
								<Star size="16px" className="mr-1 " /> Favorite
							</span>
						)}
					</ContextMenuItem>
					<ContextMenuItem onClick={handleDetailsClick} className="cursor-pointer">
						<span className="inline-flex justify-center items-center">
							<Info size="16px" className="mr-1" />
							Details
						</span>
					</ContextMenuItem>
					<ContextMenuItem onClick={() => handleDeleteDialogOpen(true)} className="cursor-pointer">
						<span className="inline-flex justify-center items-center cursor-pointer">
							<Trash2 size="16px" className="mr-1" />
							Delete
						</span>
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			<DeleteMetafileDialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpen} />
		</>
	);
}
