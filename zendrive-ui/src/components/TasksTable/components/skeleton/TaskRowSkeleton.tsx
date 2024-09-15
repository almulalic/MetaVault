import { Task } from "@apiModels/task/Task";
import { Skeleton } from "@elements/ui/skeleton";
import { TableCell, TableRow } from "@elements/ui/table";
import { flexRender, Table } from "@tanstack/react-table";

export interface TableRowSkeletonProps {
	id: string | number;
	table: Table<Task>;
}

export default function TaskRowSkeleton({ id, table }: TableRowSkeletonProps) {
	return (
		<TableRow key={id}>
			{table.getFlatHeaders().map((header) => {
				return (
					<TableCell key={header.id} colSpan={header.colSpan}>
						{header.isPlaceholder
							? null
							: flexRender(<Skeleton key={header.id} className="h-4" />, header.getContext())}
					</TableCell>
				);
			})}
		</TableRow>
	);
}
