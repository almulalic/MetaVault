import { useState } from "react";
import { AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { RootState } from "@store/store";
import { Button } from "@elements/ui/button";
import { toast } from "@elements/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { set_user_favorites } from "@store/slice";
import { generateRandomString } from "@utils/utils";
import { TaskService } from "@services/task/TaskService";
import { useDispatch, useSelector } from "react-redux";
import { MetafileService } from "@services/MetafileService";
import { DeleteTaskParameters } from "@apiModels/task/parameters/DeleteTaskParameters";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@elements/ui/dialog";

export interface DeleteMetafileDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteMetafileDialog({ open, onOpenChange }: DeleteMetafileDialogProps) {
	const [isLoading, setLoading] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { currentMetafile, selectionState } = useSelector((state: RootState) => state.fileTable);
	const { favorites } = useSelector((state: RootState) => state.user);

	const handleCancel = () => {
		onOpenChange(false);
	};

	async function deleteMetafiles(): Promise<boolean> {
		if (selectionState.entities.length > 1) {
			const response: AxiosResponse = await TaskService.runDelete(
				new DeleteTaskParameters(selectionState.entities.map((x) => x.id))
			);

			if (response.status === 200) {
				navigate(`/tasks/${response.data.id}`);
				toast({
					title: `Sucessfully initialized delete task: ${response.data.id}`
				});
			} else {
				toast({
					title: "An error has occured",
					description: `${response.status}: ${response.data.error || response.data.message}`
				});
			}

			return false;
		} else {
			const metafileId: string = selectionState.entities[0].id;
			const response: AxiosResponse<boolean> = await MetafileService.delete(metafileId);

			if (response.status === 200) {
				toast({
					title: `Sucessfully deleted metafile ${metafileId}.`
				});
			} else {
				toast({
					title: "An error has occured",
					description: `${response.status}: ${response.data.error || response.data.message}`
				});
			}

			return true;
		}
	}

	const handleConfirm = async () => {
		setLoading(true);

		try {
			let shouldRefresh: boolean = await deleteMetafiles();

			const ids = selectionState.entities.map((x) => x.id);
			dispatch(set_user_favorites(favorites.filter((x) => !ids.includes(x.metafileView.id))));

			if (shouldRefresh) {
				navigate(`/files/tree/${currentMetafile?.id}?updateId=${generateRandomString()}`);
			}
		} finally {
			setLoading(false);
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
						{selectionState.entities.length === 1 ? (
							<p>Are you sure you want to delete file {selectionState.entities[0].name}?</p>
						) : (
							<p>Are you sure you want to delete all {selectionState.entities.length} metafiles?</p>
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
