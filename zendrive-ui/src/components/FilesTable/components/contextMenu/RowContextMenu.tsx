import { UserFavorite } from "@apiModels/userFavorite/UserFavorite";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger
} from "@components/ui/context-menu";
import { UserFavoriteService } from "@services/UserFavoriteService";
import { set_user_favorites } from "../../../../store/authSlice";
import { RootState } from "../../../../store";
import { Row } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ReactNode, useState } from "react";
import { DeleteMetafileDialog } from "./DeleteMetafileDialog";
import { Star, StarOff, Trash2 } from "lucide-react";

export interface RowContextMenuProps {
	rowData: Row<MetaFile>;
	children: ReactNode;
}

export default function RowContextMenu({ rowData, children }: RowContextMenuProps) {
	const dispatch = useDispatch();
	const { userInfo } = useSelector((state: RootState) => state.auth);

	async function addToFavorites(metafileId: string) {
		const response: AxiosResponse<UserFavorite> = await UserFavoriteService.add({
			metafileId: metafileId
		});

		if (response.status === 200) {
			dispatch(set_user_favorites([...userInfo?.favorites!, response.data]));
		}
	}

	async function removeFromFavorites(metafileId: string) {
		const response: AxiosResponse<UserFavorite> = await UserFavoriteService.remove({
			metafileId: metafileId
		});

		if (response.status === 200) {
			dispatch(set_user_favorites(userInfo?.favorites.filter((x) => x.metafile.id !== metafileId)));
		}
	}

	async function handleFavorite() {
		if (userInfo?.favorites.some((x) => x.metafile.id === rowData.original.id)) {
			removeFromFavorites(rowData.original.id);
		} else {
			addToFavorites(rowData.original.id);
		}
	}

	const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

	function handleDeleteDialogOpen(open: boolean) {
		setDeleteDialogOpen(open);
	}

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

				<ContextMenuContent>
					<ContextMenuItem onClick={handleFavorite}>
						{userInfo?.favorites.some((x) => x.metafile.id === rowData.original.id) ? (
							<span className="inline-flex justify-center items-center cursor-pointer">
								<StarOff size="16px" className="mr-1" /> Unfavorite
							</span>
						) : (
							<span className="inline-flex justify-center items-center cursor-pointer">
								<Star size="16px" className="mr-1 " /> Favorite
							</span>
						)}
					</ContextMenuItem>
					<ContextMenuItem onClick={() => handleDeleteDialogOpen(true)}>
						<span className="inline-flex justify-center items-center cursor-pointer">
							<Trash2 size="16px" className="mr-1" />
							Delete
						</span>
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			<DeleteMetafileDialog
				open={isDeleteDialogOpen}
				onOpenChange={handleDeleteDialogOpen}
				metafile={rowData.original}
			/>
		</>
	);
}
