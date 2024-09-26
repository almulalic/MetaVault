import { RefreshCw } from "lucide-react";
import { Task } from "@apiModels/task/Task";
import { Toggle } from "@elements/ui/toggle";
import { RootState } from "../../store/store";
import { SelectionState } from "@store/slice";
import { useNavigate } from "react-router-dom";
import { TaskService } from "@services/task/TaskService";
import { PageRequest } from "@apiModels/PageRequest";
import { useDispatch, useSelector } from "react-redux";
import { FilePage } from "@components/FilePage/FilePage";
import { DataTable } from "@elements/DataTable/DataTable";
import TaskRowSkeleton from "./components/TaskRowSkeleton";
import { Table, ColumnDef, Row } from "@tanstack/react-table";
import { AllTasksTableColumnDef } from "@pages/Tasks/Columns";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { set_manual_select_showed } from "@store/slice/userSlice";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TaskRowContextMenu } from "./components/TaskRowContextMenu";
import SelectBoxCheckedIcon from "@assets/icons/SelectBoxCheckedIcon";
import SelectBoxUncheckedIcon from "@assets/icons/SelectBoxUncheckedIcon";
import { set_task_selection_state, set_tasks_loading } from "@store/slice/taskTableSlice";
import { TasksService } from "@services/task/TasksService";

export default function Tasks() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [isInitialLoad, setInitialLoad] = useState<boolean>(true);

	const { manualSelectShown } = useSelector((state: RootState) => state.user);
	const { selectionState, pollInterval } = useSelector((state: RootState) => state.taskTable);
	const columns: ColumnDef<Task>[] = useMemo<ColumnDef<Task>[]>(() => AllTasksTableColumnDef(), []);

	const {
		isLoading: tasksLoading,
		data: tasksPage,
		refetch
	} = useQuery({
		queryKey: ["tasks", currentPage],
		queryFn: async () =>
			(await TasksService.getPage(new PageRequest(currentPage - 1, pageSize, "createdAt,desc")))
				.data,
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

	if (!tasksPage) {
		return;
	}

	function handleManualSelect(state: boolean) {
		dispatch(set_manual_select_showed(state));
	}

	const onRowDoubleClick = (
		_: MouseEvent<HTMLTableRowElement>,
		__: Table<Task>,
		row: Row<Task>
	) => {
		if (row) {
			navigate(`/tasks/${row.original.id}`);
		}
	};

	const onSelectChange = (selectionState: SelectionState<Task>): Task[] => {
		dispatch(set_task_selection_state(selectionState));
		return selectionState.entities;
	};

	return (
		<FilePage title="test">
			<div className="relative flex flex-col justify-between gap-8 w-full overflow-hidden mt-4">
				<div className="flex items-center justify-start gap-4">
					<Heading type={HeadingType.THREE} className="whitespace-nowrap">
						Tasks
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
						data={tasksPage?.content}
						isLoading={tasksLoading}
						isInitialLoad={isInitialLoad}
						selectionState={selectionState}
						rowSkeleton={TaskRowSkeleton}
						onRowDoubleClick={onRowDoubleClick}
						onSelectChange={onSelectChange}
						rowContextMenu={TaskRowContextMenu}
						pagination={{
							current: currentPage,
							totalPages: tasksPage?.totalPages!,
							onPageChange: (page) => setCurrentPage(page)
						}}
					/>
				</div>
			</div>
		</FilePage>
	);
}
