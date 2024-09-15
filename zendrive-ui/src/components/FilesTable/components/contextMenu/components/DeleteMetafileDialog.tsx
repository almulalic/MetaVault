import { useState } from "react";
import { AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { RootState } from "@store/store";
import { Button } from "@elements/ui/button";
import { toast } from "@elements/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { generateRandomString } from "@utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { MetafileService } from "@services/MetafileService";
import { set_selected_metafiles, set_user_favorites } from "@store/slice";
import { MetafileBulkDeleteDto } from "@apiModels/metafile/dto/MetafileBulkDeleteDto";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@elements/ui/dialog";

export interface DeleteMetafileDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteMetafileDialog({ open, onOpenChange }: DeleteMetafileDialogProps) {
	const [isLoading, setLoading] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { currentMetafile, selectedMetafiles } = useSelector((state: RootState) => state.fileTable);
	const { favorites } = useSelector((state: RootState) => state.user);

	const handleCancel = () => {
		onOpenChange(false);
	};

	async function deleteMetafiles() {
		const response: AxiosResponse =
			selectedMetafiles.length > 1
				? await MetafileService.bulkFileDelete(
						new MetafileBulkDeleteDto(selectedMetafiles.map((x) => x.id))
				  )
				: await MetafileService.fileDelete(selectedMetafiles[0].id);

		if (response.status === 200) {
			toast({
				title: `Sucessfully deleted.`
			});
		} else {
			toast({
				title: "An error has occured",
				description: `${response.status}: ${response.data.error || response.data.message}`
			});
		}
	}

	const handleConfirm = async () => {
		setLoading(true);

		try {
			await deleteMetafiles();

			const ids = selectedMetafiles.map((x) => x.id);
			dispatch(set_user_favorites(favorites.filter((x) => !ids.includes(x.metafileView.id))));

			navigate(`/files/tree/${currentMetafile?.id}?updateId=${generateRandomString()}`);
		} finally {
			setLoading(false);
			dispatch(set_selected_metafiles([]));
		}

		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete file</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col">
					<div className="mb-4">
						{selectedMetafiles.length === 1 ? (
							<p>Are you sure you want to delete file {selectedMetafiles[0].name}?</p>
						) : (
							<p>Are you sure you want to delete all {selectedMetafiles.length} metafiles?</p>
						)}
					</div>
					<div className="flex w-full gap-4">
						<Button onClick={handleCancel} variant="secondary" className="w-full" size="sm">
							Cancel
						</Button>
						<Button
							onClick={handleConfirm}
							className="w-full"
							size="sm"
							variant="destructive"
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Confirm
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
