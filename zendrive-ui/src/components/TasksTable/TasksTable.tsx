import {
	Row,
	ColumnDef,
	flexRender,
	useReactTable,
	Table as ITable,
	getCoreRowModel
} from "@tanstack/react-table";
import { useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@elements/ui/table";
import { Task } from "@apiModels/task/Task";
import TaskRowSkeleton from "./components/skeleton/TaskRowSkeleton";

export interface DataTableProps {
	columns: ColumnDef<Task, Task>[];
	data: Task[];
	onRowClick: (table: ITable<Task>, row: Row<Task> | null, metafile: any) => any;
	onRowBack: () => void;
	isLoading: boolean;
	isInitialLoad: boolean;
}

export function TasksTable({
	columns,
	data,
	onRowClick,
	isLoading,
	isInitialLoad
}: DataTableProps) {
	const table: ITable<Task> = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			size: 100
		}
	});

	const tableRef = useRef<HTMLDivElement>(null);

	function onRowSelect(e: React.MouseEvent, row: Row<Task>) {}

	const onRowDeselect = () => {};

	return (
		<div className="rounded-md border" ref={tableRef}>
			<Table>
				<TableHeader onClick={() => onRowDeselect()}>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id} colSpan={header.colSpan}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{isLoading && isInitialLoad ? (
						[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
							<TaskRowSkeleton id={x} key={x} table={table} />
						))
					) : (
						<>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										className="cursor-pointer select-none"
										data-state={row.getIsSelected() && "selected"}
										onClick={(e) => onRowSelect(e, row)}
										onDoubleClick={(_) => onRowClick(table, row, row.original)}
										onContextMenu={(e) => {
											onRowSelect(e, row);
										}}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												className="max-w-72 text-ellipsis whitespace-nowrap overflow-hidden"
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										No results.
									</TableCell>
								</TableRow>
							)}
						</>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
