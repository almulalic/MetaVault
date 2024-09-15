"use client";

import { DateTime } from "luxon";
import { Badge } from "@elements/ui/badge";
import { Task } from "@apiModels/task/Task";
import { taskStateColor } from "@utils/colors";
import { Progress } from "@elements/ui/progress";
import { ColumnDef } from "@tanstack/react-table";

export const TasksTableColumnDef = (): ColumnDef<Task>[] => [
	{
		accessorKey: "data.name",
		header: "Name"
	},
	{
		accessorKey: "progress",
		header: "Progress",
		cell: ({ row }) => {
			const progressBar = row.original.data.metadata.taskRunrDashboardProgressBar2;

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
		cell: ({ row }) =>
			DateTime.fromISO(row.original.createdAt || "").toFormat("dd-MM-yyyy HH:mm:ss")
	},
	{
		accessorKey: "lastUpdatedAt",
		header: "Last Updated",
		cell: ({ row }) =>
			DateTime.fromISO(row.original.updatedAt || "").toFormat("dd-MM-yyyy HH:mm:ss")
	}
];
