import { ErrorResponse } from "@apiModels/ErrorResponse";
import { DeleteTaskDto } from "@apiModels/task/DeleteTaskDto";
import { Task } from "@apiModels/task/Task";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@elements/ui/alert-dialog";
import { toast } from "@elements/ui/use-toast";
import { TaskService } from "@services/task/TaskService";
import { SelectionState } from "@store/slice";

export interface DeleteTaskAlertProps {
	isOpen: boolean;
	setOpen: (state: boolean) => void;
	selectionState: SelectionState<Task>;
}

export default function DeleteTaskAlert({ selectionState, isOpen, setOpen }: DeleteTaskAlertProps) {
	const tasks: Task[] = selectionState.entities;

	if (tasks.length === 0) {
		return;
	}

	const onClick = async () => {
		try {
			await TaskService.stopMany(new DeleteTaskDto(tasks.map((x) => x.id)));
			setOpen(false);
		} catch (err) {
			if (err instanceof ErrorResponse) {
				toast({
					title: "Unhandled exception",
					description: err.message
				});
			}
		}
	};

	const label: string = tasks.length > 1 ? "tasks" : "task";

	return (
		<AlertDialog open={isOpen} onOpenChange={setOpen}>
			<AlertDialogContent className="w-[80%]">
				<AlertDialogHeader>
					<AlertDialogTitle>Delete {label}</AlertDialogTitle>
				</AlertDialogHeader>
				<div className="text-base">
					Are you sure that you want to delete
					<span className="font-bold">
						{" "}
						{tasks.length === 1 ? tasks[0].data.name : `all ${tasks.length}`}{" "}
					</span>
					{label}?
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onClick} className="bg-red-600 text-white">
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
