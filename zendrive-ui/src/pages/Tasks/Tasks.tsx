import { AxiosResponse } from "axios";
import { Task } from "@apiModels/task/Task";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { TaskService } from "@services/TaskService";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FilePage } from "@components/FilePage/FilePage";
import { Table, ColumnDef, Row } from "@tanstack/react-table";
import { TasksTable } from "@components/TasksTable/TasksTable";
import { set_tasks_loading } from "@store/slice/taskTableSlice";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { TasksTableColumnDef } from "@components/TasksTable/components/Columns";
import { PageRequest } from "@apiModels/PageRequest";
import { Page } from "@apiModels/Page";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from "@elements/ui/pagination";
import { cn } from "@utils/utils";

export default function Tasks() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [tasks, setTasks] = useState<Task[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [paginationPages, setPaginationPages] = useState<number[]>([]);
	const [totalPages, setTotalPages] = useState<number>(0);

	const [isInitialLoad, setInitialLoad] = useState<boolean>(true);

	const columns: ColumnDef<Task>[] = useMemo<ColumnDef<Task>[]>(() => TasksTableColumnDef(), []);

	const {
		areTasksLoading: tasksLoading,
		runningTasks,
		pollInterval
	} = useSelector((state: RootState) => state.taskTable);

	async function getAllTasks() {
		dispatch(set_tasks_loading(true));

		const response: AxiosResponse<Page<Task>> = await TaskService.getAll(
			new PageRequest(currentPage - 1, pageSize, "updatedAt,desc")
		);

		if (response.status === 200) {
			setTasks(response.data.content);
			const pagesMax = response.data.totalPages;
			const pagination = [];

			if (currentPage - 1 > 0) {
				pagination.push(currentPage - 1);
			}

			pagination.push(currentPage);

			if (currentPage + 1 <= pagesMax) {
				pagination.push(currentPage + 1);
			}

			setTotalPages(pagesMax);
			setPaginationPages(pagination);

			setInitialLoad(false);
		}

		dispatch(set_tasks_loading(false));
	}

	useEffect(() => {
		getAllTasks();
		const intervalId = setInterval(getAllTasks, pollInterval);
		return () => clearInterval(intervalId);
	}, [runningTasks.length, pollInterval, currentPage]);

	const handleRowClick = (_: Table<Task>, row: Row<Task> | null, __: any) => {
		if (row) {
			navigate(`/tasks/${row.original.id}`);
		}
	};

	const onPreviousPage = () => {
		if (currentPage - 1 > 0) {
			setCurrentPage(currentPage - 1);
		}
	};

	const onNextPage = () => {
		if (currentPage + 1 <= totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const onPaginationNumberClick = (page: number) => {
		if (page <= totalPages) {
			setCurrentPage(page);
		}
	};

	return (
		<FilePage title="test">
			<div className="relative flex flex-col justify-between gap-8 w-full overflow-hidden mt-4">
				<div className="flex justify-between items-center mb-4">
					<Heading type={HeadingType.THREE} className="whitespace-nowrap">
						Tasks
					</Heading>
				</div>

				<div className="flex flex-col justify-center gap-4">
					<TasksTable
						columns={columns}
						data={tasks}
						onRowClick={handleRowClick}
						onRowBack={() => {}}
						isLoading={tasksLoading}
						isInitialLoad={isInitialLoad}
					/>

					<Pagination>
						<PaginationContent>
							<PaginationItem
								className={cn(
									"cursor-pointer",
									tasksLoading || (currentPage === 1 && "cursor-not-allowed hover:bg-muted")
								)}
							>
								<PaginationPrevious onClick={onPreviousPage} />
							</PaginationItem>
							{paginationPages.map((number, index) => {
								return (
									<PaginationItem key={index}>
										<PaginationLink
											onClick={() => onPaginationNumberClick(number)}
											isActive={number == currentPage}
										>
											{number}
										</PaginationLink>
									</PaginationItem>
								);
							})}
							{paginationPages.length < totalPages && currentPage < totalPages - 2 && (
								<PaginationItem className="cursor-pointer">
									<PaginationEllipsis />
								</PaginationItem>
							)}
							<PaginationItem className="cursor-pointer">
								<PaginationNext onClick={onNextPage} />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</FilePage>
	);
}
