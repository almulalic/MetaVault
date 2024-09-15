import { Pencil1Icon } from "@radix-ui/react-icons";
import { CellContext } from "@tanstack/react-table";
import { useRef, useState } from "react";

export interface EditableCellProps extends CellContext<File, unknown> {}

export default function EditableCell({ getValue, row, column, table }: EditableCellProps) {
	const initialValue = getValue();
	const labelRef = useRef(null);

	const [value, setValue] = useState(initialValue);
	const [isHovering, setIsHovering] = useState(false);

	return (
		<span>
			<span
				className="flex flex-row items-center gap-2 hover:cursor-pointer"
				onMouseOver={() => {
					setIsHovering(true);
				}}
				onMouseLeave={() => {
					setIsHovering(false);
				}}
			>
				<span
					ref={labelRef}
					className="truncate inline-block hover:cursor-pointer"
					onBlur={() => {
						table.options.meta?.updateData(row.index, column.id, value);
					}}
				>
					{value as string}
				</span>

				<Pencil1Icon className={`cursor-pointer ${isHovering ? "visible" : "invisible"}`} />
			</span>
		</span>
	);
}
