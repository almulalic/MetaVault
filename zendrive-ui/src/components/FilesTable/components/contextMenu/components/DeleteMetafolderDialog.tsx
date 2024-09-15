import { useState } from "react";
import { AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { RootState } from "@store/store";
import { Button } from "@elements/ui/button";
import { toast } from "@elements/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MetafileService } from "@services/MetafileService";
import { CreateTaskResponse } from "@apiModels/task/CreateTaskResponse";
import { set_selected_metafiles, set_user_favorites } from "@store/slice";
import { DeleteTaskRequest } from "@apiModels/task/implementation/DeleteTask";
import { MetafileBulkDeleteDto } from "@apiModels/metafile/dto/MetafileBulkDeleteDto";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@elements/ui/dialog";

export interface DeleteMetafolderDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteMetafolderDialog({ open, onOpenChange }: DeleteMetafolderDialogProps) {
	const [isLoading, setLoading] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { selectedMetafiles } = useSelector((state: RootState) => state.fileTable);
	const { favorites } = useSelector((state: RootState) => state.user);

	const handleCancel = () => {
		onOpenChange(false);
	};

	async function deleteMetafolders() {
		const response: AxiosResponse<CreateTaskResponse<DeleteTaskRequest>[]> =
			await MetafileService.bulkFolderDelete(
				new MetafileBulkDeleteDto(selectedMetafiles.map((x) => x.id))
			);

		if (response.status === 200) {
			toast({
				title: `Sucessfully deleted.`
			});

			return null;
		} else {
			toast({
				title: "An error has occured",
				description: `${response.status}: Error`
			});
		}
	}

	async function deleteMetafolder() {
		const response: AxiosResponse<CreateTaskResponse<DeleteTaskRequest>> =
			await MetafileService.folderDelete(selectedMetafiles[0].id);

		if (response.status === 200) {
			toast({
				title: `Sucessfully deleted.`
			});

			return response.data.id;
		} else {
			toast({
				title: "An error has occured",
				description: `${response.status}: Error`
			});
		}
	}

	const handleConfirm = async () => {
		setLoading(true);

		try {
			let id = selectedMetafiles.length > 1 ? await deleteMetafolders() : await deleteMetafolder();

			const ids = selectedMetafiles.map((x) => x.id);
			dispatch(set_user_favorites(favorites.filter((x) => !ids.includes(x.metafileView.id))));

			if (id == null) {
				navigate("/tasks/");
			} else {
				navigate(`/tasks/${id}`);
			}
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
					<DialogTitle>Delete folder</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col">
					<div className="mb-4">
						{selectedMetafiles.length === 1 ? (
							<p>
								Are you sure you want to delete folder {selectedMetafiles[0].name} and all it's
								children?
							</p>
						) : (
							<p>
								Are you sure you want to delete all {selectedMetafiles.length} metafiles and all
								it's children?
							</p>
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
