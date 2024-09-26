import { AxiosResponse } from "axios";
import { toast } from "@elements/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { MetaFile } from "@apiModels/metafile";
import { TaskService } from "@services/task/TaskService";
import { ConflictStrategy } from "@apiModels/task/ConflictStrategy";
import { CreateTaskResponse } from "@apiModels/task/CreateTaskResponse";
import { SyncTaskParameters } from "@apiModels/task/parameters/SyncTaskParameters";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogDescription
} from "@elements/ui/alert-dialog";
import { ErrorResponse } from "@apiModels/ErrorResponse";

export interface SyncAlertDialogProps {
	metafile: MetaFile;
	isOpen: boolean;
	onOpenChange: (value: boolean) => void;
}

export function SyncAlertDialog({ metafile, isOpen, onOpenChange }: SyncAlertDialogProps) {
	const navigate = useNavigate();

	async function runSyncTask() {
		try {
			const response: AxiosResponse<CreateTaskResponse<SyncTaskParameters>> =
				await TaskService.runSync(new SyncTaskParameters(metafile.id, ConflictStrategy.OVERRIDE));

			navigate(`/tasks/${response.data.id}`);
		} catch (err) {
			if (err instanceof ErrorResponse) {
				toast({
					title: "Something went wrong!",
					description: err.message
				});
			}
		}
	}

	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Sync task</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription className="text-base">
					Are you sure that you want to run sync task for metafile{" "}
					<span className="font-bold">{metafile.id}</span>?
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={runSyncTask}>Sync</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
