import { DateTime } from "luxon";
import { convertBytes } from "@utils/utils";
import { toast } from "@elements/ui/use-toast";
import { Checkbox } from "@elements/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { MetaFile } from "@apiModels/metafile/MetaFile";
import { FileTextIcon, FolderIcon } from "lucide-react";
import { isFolder } from "@utils/metafile";

export const SearchFileColumnDef: ColumnDef<MetaFile>[] = [
	{
		id: "manualSelect",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value: boolean) => {
					table.toggleAllPageRowsSelected(!!value);
				}}
				aria-label="Select all"
			/>
		),
		cell: ({ row, table }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				onClick={(e: React.MouseEvent) => {
					if (e.shiftKey) {
						// const { rows, rowsById } = table.getRowModel();

						try {
							// const rowsToToggle = getRowRange(rows, row.id, lastSelectedId);
							// const isLastSelected = rowsById[lastSelectedId].getIsSelected();
							// rowsToToggle.forEach((row) => row.toggleSelected(isLastSelected));
						} catch (e) {
							toast({
								description: "Multi-select with shift+click is disabled across multiple pages"
							});
							row.toggleSelected(!row.getIsSelected());
						}
					} else {
						row.toggleSelected(!row.getIsSelected());
					}

					// dispatch(set_last_selected_id(row.id));
				}}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: true
	},
	{
		id: "icon",
		enableResizing: false,
		cell: ({ row }) => (
			<div className="flex items-center">
				{isFolder(row.original) ? (
					<FolderIcon className="h-8 w-8" />
				) : (
					<FileTextIcon className="h-8 w-8" />
				)}
			</div>
		),
		header: () => <div className="flex items-center"></div>,
		enableSorting: false
	},
	{
		accessorKey: "name",
		header: "Name"
	},

	{
		accessorKey: "size",
		header: "Size",
		cell: ({ row }) => convertBytes(row.original.size)
	},
	{
		accessorKey: "lastModifiedMs",
		header: "Last Modified",
		cell: ({ row }) =>
			DateTime.fromMillis(row.original.lastModifiedMs || 0).toFormat("dd-MM-yyyy HH:mm:ss")
	},
	{
		accessorKey: "lastSyncedMs",
		header: "Last Sync",
		cell: ({ row }) =>
			DateTime.fromMillis(row.original.lastSyncMs || 0).toFormat("dd-MM-yyyy HH:mm:ss")
	}
];
