import { ErrorResponse } from "@apiModels/ErrorResponse";
import { RecurringTask } from "@apiModels/task/RecurringTask";
import {
	AlertDialog,
	AlertDialogTitle,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogDescription
} from "@elements/ui/alert-dialog";
import { SelectionState } from "@store/slice";
import { toast } from "@elements/ui/use-toast";
import { DeleteTaskDto } from "@apiModels/task/DeleteTaskDto";
import { RecurringTaskService } from "@services/task/RecurringTaskService";

export interface DeleteRecurringTaskAlertProps {
	isOpen: boolean;
	setOpen: (state: boolean) => void;
	selectionState: SelectionState<RecurringTask>;
}

export default function DeleteRecurringTaskAlert({
	selectionState,
	isOpen,
	setOpen
}: DeleteRecurringTaskAlertProps) {
	const recurringTasks: RecurringTask[] = selectionState.entities;

	if (recurringTasks.length === 0) {
		return;
	}

	const onClick = async () => {
		try {
			if (recurringTasks.length > 1) {
				await RecurringTaskService.deleteAll(new DeleteTaskDto(recurringTasks.map((x) => x.id)));
			} else {
				await RecurringTaskService.delete(recurringTasks[0].id);
			}
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

	const label: string = recurringTasks.length > 1 ? "recurring tasks" : "recurring task";

	return (
		<AlertDialog open={isOpen} onOpenChange={() => setOpen(!isOpen)}>
			<AlertDialogContent className="w-[80%]">
				<AlertDialogHeader>
					<AlertDialogTitle>Delete recurring {label}</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription className="text-base">
					<div className="text-base">
						Are you sure that you want to delete
						<span className="font-bold">
							{" "}
							{recurringTasks.length === 1
								? recurringTasks[0].data.name
								: `all ${recurringTasks.length}`}{" "}
						</span>
						{label}?
					</div>
				</AlertDialogDescription>
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
