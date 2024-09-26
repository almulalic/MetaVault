import {
	Row,
	ColumnDef,
	flexRender,
	useReactTable,
	Table as ITable,
	getCoreRowModel
} from "@tanstack/react-table";
import { RootState } from "@store/store";
import { useSelector } from "react-redux";
import { getRowRange } from "@utils/utils";
import { SelectionState } from "@store/slice";
import { ReactNode, useEffect, useRef, MouseEvent } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@elements/ui/table";
import { Pagination, PaginationProps } from "@elements/Pagination/Pagination";

export interface TableRow {
	id: string;
}

export interface RowContextMenuProps<T extends TableRow> {
	row: Row<T>;
	children: ReactNode;
}

export type RowContextMenuComponent<T extends TableRow> = (
	props: RowContextMenuProps<T>
) => JSX.Element | undefined;

export interface RowSkeletonProps<T extends TableRow> {
	id: string | number;
	table: ITable<T>;
}

export type RowSkeletonComponent<T extends TableRow> = (
	props: RowSkeletonProps<T>
) => JSX.Element | undefined;

export interface TablePagination extends PaginationProps {}

export interface DataTableProps<T extends TableRow> {
	columns: ColumnDef<T, T>[];
	data: T[];
	isLoading: boolean;
	isInitialLoad: boolean;
	selectionState?: SelectionState<T>;
	pagination?: TablePagination;
	onRowDeselect?: () => void;
	rowSkeleton?: RowSkeletonComponent<T>;
	onSelectChange?: (selectionState: SelectionState<T>) => void;
	rowContextMenu?: RowContextMenuComponent<T>;
	onRowDoubleClick?: (e: MouseEvent<HTMLTableRowElement>, table: ITable<T>, row: Row<T>) => void;
	onRowClick?: (e: MouseEvent<HTMLTableRowElement>, table: ITable<T>, row: Row<T>) => void;
	onContextMenu?: (e: MouseEvent<HTMLTableRowElement>, table: ITable<T>, row: Row<T>) => void;
	onRowBack?: () => void;
}

export function DataTable<T extends TableRow>({
	data,
	columns,
	isLoading,
	pagination,
	onRowClick,
	rowSkeleton,
	onRowDeselect,
	isInitialLoad,
	onContextMenu,
	selectionState,
	onSelectChange,
	rowContextMenu,
	onRowDoubleClick
}: DataTableProps<T>) {
	const RowContextMenu: RowContextMenuComponent<T> | undefined = rowContextMenu || undefined;
	const RowSkeleton: RowSkeletonComponent<T> | undefined = rowSkeleton;

	const tableRef = useRef<HTMLDivElement>(null);

	const table: ITable<T> = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			size: 100
		}
	});

	const { manualSelectShown } = useSelector((state: RootState) => state.user);

	const onRowSelectInternal = (
		e: MouseEvent<HTMLTableRowElement>,
		table: ITable<T>,
		row: Row<T>,
		selectionState: SelectionState<T>
	): SelectionState<T> => {
		const { rows } = table.getRowModel();

		if (e.shiftKey) {
			if (manualSelectShown) {
				row.toggleSelected(!row.getIsSelected());

				if (row.getIsSelected()) {
					selectionState.entities = selectionState.entities.filter((x) => x.id !== row.id);
				} else {
					selectionState.entities = [...selectionState.entities, row.original];
				}

				return selectionState;
			}

			try {
				const [rowsToSelect, newSelectionState]: [Row<T>[], SelectionState<T>] = getRowRange<T>(
					rows,
					selectionState,
					row.index
				);

				const selectedIds = rowsToSelect.map((x) => x.index);

				rows
					.filter((x) => !selectedIds.includes(x.index))
					.forEach((row) => row.toggleSelected(false));

				rowsToSelect.forEach((row) => row.toggleSelected(true));

				return newSelectionState;
			} catch (e) {
				table.toggleAllPageRowsSelected(false);
				row.toggleSelected(!row.getIsSelected());
				return selectionState;
			}
		} else {
			table.toggleAllPageRowsSelected(false);
			row.toggleSelected(true);

			return {
				start: row.index,
				end: row.index,
				entities: [row.original]
			};
		}
	};

	const onRowClickInternal = (
		e: MouseEvent<HTMLTableRowElement>,
		table: ITable<T>,
		row: Row<T>
	) => {
		if (row && selectionState) {
			onSelectChange && onSelectChange(onRowSelectInternal(e, table, row, selectionState));
		}

		onRowClick?.(e, table, row);
	};

	const onRowDoubleClickInternal = (
		e: MouseEvent<HTMLTableRowElement>,
		table: ITable<T>,
		row: Row<T>
	) => {
		if (
			selectionState &&
			selectionState.entities.length <= 1 &&
			!selectionState.entities.some((x) => x.id === row.original.id) &&
			!e.shiftKey
		) {
			onRowClick?.(e, table, row);
		} else {
			onRowDoubleClick?.(e, table, row);
		}
	};

	const onContextMenuInternal = (
		e: MouseEvent<HTMLTableRowElement>,
		table: ITable<T>,
		row: Row<T>
	) => {
		if (
			selectionState &&
			selectionState.entities.length <= 1 &&
			!selectionState.entities.some((x: any) => x.id === row.original.id)
		) {
			onRowClickInternal(e, table, row);
			onRowClick?.(e, table, row);
		}

		onContextMenu?.(e, table, row);
	};

	const onRowDeselectInternal = () => {
		table.toggleAllPageRowsSelected(false);
		onRowDeselect?.();
	};

	useEffect(() => {
		table.getColumn("manualSelect")?.toggleVisibility(manualSelectShown);
	}, [manualSelectShown]);

	function renderRow(row: Row<T>) {
		return (
			<TableRow
				key={row.id}
				className="cursor-pointer select-none"
				data-state={row.getIsSelected() && "selected"}
				onClick={(e: MouseEvent<HTMLTableRowElement>) => onRowClickInternal(e, table, row)}
				onDoubleClick={(e: MouseEvent<HTMLTableRowElement>) =>
					onRowDoubleClickInternal(e, table, row)
				}
				onContextMenu={(e: MouseEvent<HTMLTableRowElement>) => onContextMenuInternal(e, table, row)}
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
		);
	}

	return (
		<div className="flex flex-col gap-4 justify-center items-center">
			<div className="rounded-md border w-full" ref={tableRef}>
				<Table>
					<TableHeader onClick={() => onRowDeselectInternal()}>
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
						{isLoading && isInitialLoad && RowSkeleton ? (
							[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
								<RowSkeleton id={x} key={x} table={table} />
							))
						) : (
							<>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) =>
										RowContextMenu ? (
											<RowContextMenu row={row} key={row.id}>
												{renderRow(row)}
											</RowContextMenu>
										) : (
											renderRow(row)
										)
									)
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
			<div className="flex justify-center items-center w-full">
				{pagination && <Pagination {...pagination} />}
			</div>
		</div>
	);
}
