import { RefreshCw } from "lucide-react";
import { Toggle } from "@elements/ui/toggle";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { PageRequest } from "@apiModels/PageRequest";
import { useDispatch, useSelector } from "react-redux";
import { FilePage } from "@components/FilePage/FilePage";
import { RecurringTasksTableColumnDef } from "./Columns";
import { DataTable } from "@elements/DataTable/DataTable";
import TaskRowSkeleton from "./components/TaskRowSkeleton";
import { SelectionState } from "@store/slice/fileTableSlice";
import { Table, ColumnDef, Row } from "@tanstack/react-table";
import { RecurringTask } from "@apiModels/task/RecurringTask";
import { set_tasks_loading } from "@store/slice/taskTableSlice";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { set_manual_select_showed } from "@store/slice/userSlice";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import SelectBoxCheckedIcon from "@assets/icons/SelectBoxCheckedIcon";
import EditRecurringTaskDialog from "./components/EditRecurringJobDialog";
import SelectBoxUncheckedIcon from "@assets/icons/SelectBoxUncheckedIcon";
import { RecurringTaskService } from "@services/task/RecurringTaskService";
import { RecurringTaskRowContextMenu } from "./components/RecurringTaskRowContextMenu";
import { set_recurring_task_selection_state } from "@store/slice/recurringTaskTableSlice";

export default function RecurringTasks() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [isInitialLoad, setInitialLoad] = useState<boolean>(true);

	const { manualSelectShown } = useSelector((state: RootState) => state.user);
	const { selectionState, pollInterval } = useSelector((state: RootState) => state.recurringTask);
	const columns: ColumnDef<RecurringTask>[] = useMemo<ColumnDef<RecurringTask>[]>(
		() => RecurringTasksTableColumnDef(),
		[]
	);

	const {
		isLoading: tasksLoading,
		data: tasksPage,
		refetch
	} = useQuery({
		queryKey: ["recurringTasks", currentPage],
		queryFn: async () =>
			(
				await RecurringTaskService.getPage(
					new PageRequest(currentPage - 1, pageSize, "createdAt,desc")
				)
			).data,
		refetchInterval: pollInterval,
		placeholderData: keepPreviousData
	});

	useEffect(() => {
		const params = new URLSearchParams();
		params.set("page", currentPage.toString());
		params.set("size", pageSize.toString());
		navigate(`?${params.toString()}`, { replace: true });
	}, [currentPage, pageSize, navigate]);

	useEffect(() => {
		setInitialLoad(false);
		dispatch(set_tasks_loading(tasksLoading));
	}, [tasksLoading]);

	const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
	const [selectedTask, setSelectedTask] = useState<RecurringTask | null>(null);

	if (!tasksPage) {
		//todo fix
		return;
	}

	const onOpenEditModalChange = (state: boolean) => {
		setEditModalOpen(state);
	};

	function handleManualSelect(state: boolean) {
		dispatch(set_manual_select_showed(state));
	}

	const onRowDoubleClick = (
		_: MouseEvent<HTMLTableRowElement>,
		__: Table<RecurringTask>,
		row: Row<RecurringTask>
	) => {
		if (row) {
			setSelectedTask(row.original);
		}

		onOpenEditModalChange(true);
	};

	const onSelectChange = (selectionState: SelectionState<RecurringTask>): RecurringTask[] => {
		dispatch(set_recurring_task_selection_state(selectionState));
		return selectionState.entities;
	};

	return (
		<FilePage title="test">
			<div className="relative flex flex-col justify-between gap-8 w-full overflow-hidden mt-4">
				<div className="flex items-center justify-start gap-4">
					<Heading type={HeadingType.THREE} className="whitespace-nowrap">
						Recurring Tasks
					</Heading>

					<RefreshCw
						className="w-4 h-4 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
						onClick={() => refetch()}
					/>

					<div className="flex items-center justify-end gap-2 w-full">
						<Toggle
							value="manualSelect"
							aria-label="Manual select"
							defaultPressed={manualSelectShown}
							onClick={() => handleManualSelect(!manualSelectShown)}
						>
							{manualSelectShown ? (
								<SelectBoxCheckedIcon className="h-6 w-6" />
							) : (
								<SelectBoxUncheckedIcon className="h-6 w-6" />
							)}
						</Toggle>
					</div>
				</div>

				<div className="flex flex-col justify-center gap-4">
					<DataTable
						columns={columns}
						data={tasksPage?.content || []}
						selectionState={selectionState}
						onRowBack={() => {}}
						isLoading={tasksLoading}
						isInitialLoad={isInitialLoad}
						rowSkeleton={TaskRowSkeleton}
						onRowDoubleClick={onRowDoubleClick}
						onSelectChange={onSelectChange}
						rowContextMenu={RecurringTaskRowContextMenu}
						pagination={{
							current: currentPage,
							totalPages: tasksPage.totalPages,
							onPageChange: (page) => setCurrentPage(page)
						}}
					/>
				</div>
			</div>

			{selectedTask && (
				<EditRecurringTaskDialog
					isOpen={isEditModalOpen}
					onOpenChange={onOpenEditModalChange}
					recurringTask={selectedTask}
				/>
			)}
		</FilePage>
	);
}
