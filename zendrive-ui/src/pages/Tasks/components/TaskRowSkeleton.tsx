import { Skeleton } from "@elements/ui/skeleton";
import { flexRender } from "@tanstack/react-table";
import { TableCell, TableRow } from "@elements/ui/table";
import { RowSkeletonProps } from "@elements/DataTable/DataTable";

export default function TaskRowSkeleton({ id, table }: RowSkeletonProps<any>) {
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
