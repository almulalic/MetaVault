import {
	ContextMenu,
	ContextMenuItem,
	ContextMenuTrigger,
	ContextMenuContent
} from "@elements/ui/context-menu";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { RootState } from "@store/store";
import { useSelector } from "react-redux";
import { Task } from "@apiModels/task/Task";
import DeleteTaskAlert from "./DeleteTaskAlert";
import { RowContextMenuProps } from "@elements/DataTable/DataTable";

export function TaskRowContextMenu({ row, children }: RowContextMenuProps<Task>) {
	const [deleteAlertShown, setDeleteAlertShown] = useState<boolean>(false);

	const { selectionState } = useSelector((state: RootState) => state.taskTable);

	if (!row) {
		return;
	}

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild onClick={(e) => e.preventDefault()}>
				{children}
			</ContextMenuTrigger>

			<ContextMenuContent>
				<ContextMenuItem onClick={() => setDeleteAlertShown(true)} className="cursor-pointer">
					<span className="inline-flex justify-center items-center cursor-pointer">
						<Trash2 size="16px" className="mr-1" />
						Delete
					</span>
				</ContextMenuItem>
			</ContextMenuContent>

			<DeleteTaskAlert
				selectionState={selectionState}
				isOpen={deleteAlertShown}
				setOpen={setDeleteAlertShown}
			/>
		</ContextMenu>
	);
}
