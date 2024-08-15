import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@components/ui/table";
import RowContextMenu from "./components/contextMenu/RowContextMenu";

interface DataTableProps {
	columns: ColumnDef<MetaFile, MetaFile>[];
	data: MetaFile[];
	onRowClick: (a: any) => any;
	isLoading: boolean;
}

export function FilesTable({ columns, data, onRowClick, isLoading }: DataTableProps) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			size: 100
		}
	});

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
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
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								Loading...
							</TableCell>
						</TableRow>
					) : (
						<>
							<TableRow
								className="w-full cursor-pointer"
								onClick={() => onRowClick({ type: "directory", name: ".." })}
								onMouseDown={(e) => {
									e.preventDefault();
								}}
							>
								<TableCell colSpan={100}>..</TableCell>
							</TableRow>

							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<RowContextMenu rowData={row}>
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
											onClick={() => row.toggleSelected()}
											onDoubleClick={() => onRowClick(row.original)}
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
