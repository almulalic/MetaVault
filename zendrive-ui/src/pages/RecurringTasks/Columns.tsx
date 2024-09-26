import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { calculateNextCronRun } from "@utils/utils";
import { DATE_TIME_FORMAT } from "@constants/constants";
import { RecurringTask } from "@apiModels/task/RecurringTask";
import { Checkbox } from "@elements/ui/checkbox";
import { toast } from "@elements/ui/use-toast";

export const RecurringTasksTableColumnDef = (): ColumnDef<RecurringTask>[] => [
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
		accessorKey: "data.scheduleExpression",
		header: "Cron Expression"
	},
	{
		header: "Next run",
		cell: ({ row }) =>
			DateTime.fromMillis(calculateNextCronRun(row.original.data.scheduleExpression!)).toFormat(
				DATE_TIME_FORMAT
			)
	},
	{
		accessorKey: "createdAt",
		header: "Created",
		cell: ({ row }) => DateTime.fromMillis(row.original.createdAt || 0).toFormat(DATE_TIME_FORMAT)
	}
];
