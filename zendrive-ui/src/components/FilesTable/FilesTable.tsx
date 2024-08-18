import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	Row,
	Table as ITable,
	useReactTable
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@elements/ui/table";
import RowContextMenu from "./components/contextMenu/RowContextMenu";
import { getRowRange } from "@utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store/store";
import {
	set_current_as_selected,
	set_selection_state,
	set_selected_metafiles,
	set_active_metafile,
	SelectionState
} from "@store/slice/fileTableSlice";
import { useEffect, useRef } from "react";
import { MetaFile } from "@apiModels/metafile";
import { useNavigate } from "react-router-dom";
import TableRowSkeleton from "./components/skeleton/TableRowSkeleton";
import PreviousTableRow from "./components/cell/PreviousTableRow";

export interface DataTableProps {
	columns: ColumnDef<MetaFile, MetaFile>[];
	data: MetaFile[];
	onRowClick: (table: ITable<MetaFile>, row: Row<MetaFile> | null, metafile: any) => any;
	onRowBack: () => void;
	isLoading: boolean;
}

export function FilesTable({ columns, data, onRowBack, isLoading }: DataTableProps) {
	const table: ITable<MetaFile> = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			size: 100
		}
	});

	const dispatch = useDispatch();
	const { selectionState, selectedMetafiles, activeMetafile } = useSelector(
		(state: RootState) => state.fileTable
	);

	const { manualSelectShown } = useSelector((state: RootState) => state.user);

	const tableRef = useRef<HTMLDivElement>(null);

	function onRowSelect(e: React.MouseEvent, row: Row<MetaFile>) {
		const { rows } = table.getRowModel();

		if (e.shiftKey) {
			if (!selectionState) {
				return;
			}

			if (manualSelectShown) {
				if (row.getIsSelected()) {
					dispatch(set_selected_metafiles(selectedMetafiles.filter((x) => x.id !== row.id)));
				} else {
					dispatch(set_selected_metafiles([...selectedMetafiles, row.original]));
				}

				row.toggleSelected(!row.getIsSelected());
				return;
			}

			try {
				const [rowsToSelect, newSelectionState]: [Row<MetaFile>[], SelectionState] =
					getRowRange<MetaFile>(rows, selectionState, row.index);

				const selectedIds = rowsToSelect.map((x) => x.index);

				rows
					.filter((x) => !selectedIds.includes(x.index))
					.forEach((row) => row.toggleSelected(false));

				rowsToSelect.forEach((row) => row.toggleSelected(true));

				dispatch(set_selected_metafiles(rowsToSelect.map((x) => x.original)));
				dispatch(set_selection_state(newSelectionState));
			} catch (e) {
				console.log(e);
				table.toggleAllPageRowsSelected(false);
				row.toggleSelected(!row.getIsSelected());
			}
		} else {
			table.toggleAllPageRowsSelected(false);
			row.toggleSelected(true);
			dispatch(set_selected_metafiles([row.original]));
			dispatch(set_active_metafile(row.original));
			dispatch(set_selection_state({ start: row.index, end: row.index }));
		}
	}

	const navigate = useNavigate();

	const onRowDeselect = () => {
		table.toggleAllPageRowsSelected(false);
		dispatch(set_current_as_selected());
	};

	useEffect(() => {
		table.getColumn("manualSelect")?.toggleVisibility(manualSelectShown);
	}, [manualSelectShown]);

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
					{isLoading ? (
						[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
							<TableRowSkeleton id={x} key={x} table={table} />
						))
					) : (
						<>
							<PreviousTableRow onRowBack={onRowBack} onRowDeselect={onRowDeselect} />

							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<RowContextMenu rowData={row} key={row.id}>
										<TableRow
											className="cursor-pointer select-none"
											data-state={row.getIsSelected() && "selected"}
											onClick={(e) => onRowSelect(e, row)}
											onDoubleClick={(e) => {
												if (selectedMetafiles.length <= 1 && !e.shiftKey) {
													table.toggleAllPageRowsSelected(false);
													navigate(`/files/file/${row.original.id}`);
												}
											}}
											onContextMenu={(e) => {
												if (
													selectedMetafiles.length <= 1 &&
													!selectedMetafiles.some((x) => x.id === row.original.id)
												) {
													onRowSelect(e, row);
												}
											}}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											))}
										</TableRow>
									</RowContextMenu>
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
