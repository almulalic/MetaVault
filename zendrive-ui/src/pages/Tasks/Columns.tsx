import { DateTime } from "luxon";
import { Badge } from "@elements/ui/badge";
import { Task } from "@apiModels/task/Task";
import { taskStateColor } from "@utils/colors";
import { Progress } from "@elements/ui/progress";
import { ColumnDef } from "@tanstack/react-table";
import { DATE_TIME_FORMAT } from "@constants/constants";
import { toast } from "@elements/ui/use-toast";
import { Checkbox } from "@elements/ui/checkbox";

export const AllTasksTableColumnDef = (): ColumnDef<Task>[] => [
	{
		id: "manualSelect",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value: boolean) => {
					console.log(value);
					table.toggleAllPageRowsSelected(value);
				}}
				aria-label="Select all"
			/>
		),
		cell: ({ row, table }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				onClick={(e: React.MouseEvent) => {
					e.stopPropagation();

					if (e.shiftKey) {
						// const { rows, rowsById } = table.getRowModel();

						try {
							e.stopPropagation();
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
		accessorKey: "data.name",
		header: "Name"
	},
	{
		accessorKey: "progress",
		header: "Progress",
		cell: ({ row }) => {
			const progressBar = row.original.data.metadata.taskRunrDashboardProgressBar;

			return (
				<Progress
					value={progressBar ? progressBar.progress : 0}
					max={progressBar ? progressBar.totalAmount : 100}
				/>
			);
		}
	},
	{
		header: "Type",
		cell: ({ row }) => {
			return row.original.data.labels.find((x) => x.includes("type:"))?.split("type:")[1];
		}
	},
	{
		accessorKey: "state",
		header: "State",
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<Badge variant="outline" className={taskStateColor[row.original.state]}>
						<span className="font-medium text-xs">{row.original.state}</span>
					</Badge>
				</div>
			);
		}
	},
	{
		accessorKey: "createdAt",
		header: "Created",
		cell: ({ row }) => DateTime.fromISO(row.original.createdAt || "").toFormat(DATE_TIME_FORMAT)
	},
	{
		accessorKey: "lastUpdatedAt",
		header: "Last Updated",
		cell: ({ row }) => DateTime.fromISO(row.original.updatedAt || "").toFormat(DATE_TIME_FORMAT)
	}
];
