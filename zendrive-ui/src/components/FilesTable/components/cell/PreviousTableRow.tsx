import React from "react";
import { TableCell, TableRow } from "@elements/ui/table";

export interface PreviousTableRowProps {
	onRowBack: () => void;
	onRowDeselect: (e: React.MouseEvent) => void;
}

export default function PreviousTableRow({ onRowBack, onRowDeselect }: PreviousTableRowProps) {
	return (
		<TableRow
			className="w-full cursor-pointer select-none"
			onClick={onRowBack}
			onMouseDown={onRowDeselect}
		>
			<TableCell colSpan={100}>..</TableCell>
		</TableRow>
	);
}
