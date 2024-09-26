import {
	ContextMenu,
	ContextMenuItem,
	ContextMenuTrigger,
	ContextMenuContent
} from "@elements/ui/context-menu";
import { useState } from "react";
import { AxiosResponse } from "axios";
import { download } from "@utils/utils";
import { RootState } from "@store/store";
import { isFile } from "@utils/metafile";
import { MetaFile } from "@apiModels/metafile";
import { useDispatch, useSelector } from "react-redux";
import { MetafileService } from "@services/MetafileService";
import ShareDialog from "@components/ShareDialog/ShareDialog";
import { SyncAlertDialog } from "./components/SyncAlertDialog";
import { UserFavoriteService } from "@services/UserFavoriteService";
import { RowContextMenuProps } from "@elements/DataTable/DataTable";
import { DeleteMetafileDialog } from "./components/DeleteMetafileDialog";
import { UserFavoriteView } from "@apiModels/userFavorite/UserFavoriteView";
import { set_user_favorites, set_details_expanded } from "@store/slice/userSlice";
import { DownloadIcon, FolderSync, Info, Share2Icon, Star, StarOff, Trash2 } from "lucide-react";
import { ErrorResponse } from "@apiModels/ErrorResponse";
import { toast } from "@elements/ui/use-toast";

export default function FileTableRowContextMenu({ row, children }: RowContextMenuProps<MetaFile>) {
	const dispatch = useDispatch();

	const { favorites } = useSelector((state: RootState) => state.user);
	const { activeMetafile, selectionState } = useSelector((state: RootState) => state.fileTable);

	async function addToFavorites(metafiles: string[]) {
		try {
			const response: AxiosResponse<UserFavoriteView[]> = await UserFavoriteService.add({
				metafiles: metafiles
			});

			dispatch(set_user_favorites([...favorites, ...response.data]));
		} catch (err) {
			if (err instanceof ErrorResponse) {
				toast({
					title: "Something went wrong.",
					description: err.message
				});
			}
		}
	}

	async function removeFromFavorites(metafiles: string[]) {
		try {
			const response: AxiosResponse<UserFavoriteView[]> = await UserFavoriteService.remove({
				metafiles: metafiles
			});

			const deletedIds = response.data.map((x) => x.metafileView.id);

			dispatch(
				set_user_favorites(favorites.filter((x) => !deletedIds.includes(x.metafileView.id)))
			);
		} catch (err) {
			if (err instanceof ErrorResponse) {
				toast({
					title: "Something went wrong.",
					description: err.message
				});
			}
		}
	}

	async function handleFavorite() {
		const favoriteIds = favorites.map((x) => x.metafileView.id);

		if (selectionState.entities.every((x) => favoriteIds.includes(x.id))) {
			removeFromFavorites(selectionState.entities.map((x) => x.id));
		} else {
			addToFavorites(selectionState.entities.map((x) => x.id));
		}
	}

	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

	function handleDeleteDialogOpen(open: boolean) {
		setDeleteDialogOpen(open);
	}

	function handleDetailsClick() {
		dispatch(set_details_expanded(true));
	}

	const [isShareDialogOpen, setShareDialogOpen] = useState(false);

	function handleShareDialogOpen(state: boolean) {
		setShareDialogOpen(state);
	}

	const handleDownload = async (metafileId: string) => {
		download(await MetafileService.download(metafileId), metafileId);
	};

	const [isSyncAlertOpen, setSyncAlertOpen] = useState(false);
	const handleSyncAlertChange = (newState: boolean) => {
		setSyncAlertOpen(newState);
	};

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger asChild onClick={(e) => e.preventDefault()}>
					{children}
				</ContextMenuTrigger>

				<ContextMenuContent>
					<ContextMenuItem onClick={() => handleSyncAlertChange(true)} className="cursor-pointer">
						<span className="inline-flex justify-center items-center">
							<FolderSync size="16px" className="mr-1" />
							Sync
						</span>
					</ContextMenuItem>

					<ContextMenuItem onClick={() => handleShareDialogOpen(true)} className="cursor-pointer">
						<span className="inline-flex justify-center items-center">
							<Share2Icon size="16px" className="mr-1" />
							Share
						</span>
					</ContextMenuItem>

					{isFile(row.original) && (
						<ContextMenuItem
							onClick={() => handleDownload(row.original.id)}
							className="cursor-pointer"
						>
							<span className="inline-flex justify-center items-center">
								<DownloadIcon size="16px" className="mr-1" />
								Download
							</span>
						</ContextMenuItem>
					)}

					<ContextMenuItem onClick={handleFavorite} className="cursor-pointer">
						{favorites.some((x) => x.metafileView.id === row.original.id) ? (
							<span className="inline-flex justify-center items-center">
								<StarOff size="16px" className="mr-1" /> Unfavorite
							</span>
						) : (
							<span className="inline-flex justify-center items-center">
								<Star size="16px" className="mr-1 " /> Favorite
							</span>
						)}
					</ContextMenuItem>

					{/* <ContextMenuItem onClick={handleDetailsClick} className="cursor-pointer">
						<span className="inline-flex justify-center items-center">
							<Edit3 size="16px" className="mr-1" />
							Rename
						</span>
					</ContextMenuItem> */}

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

			{activeMetafile && (
				<SyncAlertDialog
					metafile={activeMetafile}
					isOpen={isSyncAlertOpen}
					onOpenChange={handleSyncAlertChange}
				/>
			)}
			<DeleteMetafileDialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpen} />
			<ShareDialog open={isShareDialogOpen} onOpenChange={handleShareDialogOpen} />
		</>
	);
}
