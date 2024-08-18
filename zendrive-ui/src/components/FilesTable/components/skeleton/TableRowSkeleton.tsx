import { MetaFile } from "@apiModels/metafile";
import { Skeleton } from "@elements/ui/skeleton";
import { TableCell, TableRow } from "@elements/ui/table";
import { flexRender, Table } from "@tanstack/react-table";

export interface TableRowSkeletonProps {
	id: string | number;
	table: Table<MetaFile>;
}

export default function TableRowSkeleton({ id, table }: TableRowSkeletonProps) {
	return (
		<TableRow key={id}>
			{id === 0 ? (
				<TableCell>
					<Skeleton className="h-6 w-8" />
				</TableCell>
			) : (
				table.getFlatHeaders().map((header) => {
					return (
						<TableCell key={header.id} colSpan={header.colSpan}>
							{header.isPlaceholder
								? null
								: flexRender(<Skeleton key={header.id} className="h-6" />, header.getContext())}
						</TableCell>
					);
				})
			)}
		</TableRow>
	);
}
