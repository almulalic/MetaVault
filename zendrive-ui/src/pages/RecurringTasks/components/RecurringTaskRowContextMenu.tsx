import {
	ContextMenu,
	ContextMenuItem,
	ContextMenuContent,
	ContextMenuTrigger
} from "@elements/ui/context-menu";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { RootState } from "@store/store";
import { useSelector } from "react-redux";
import { RecurringTask } from "@apiModels/task/RecurringTask";
import DeleteRecurringTaskAlert from "./DeleteRecurringTaskAlert";
import { RowContextMenuProps } from "@elements/DataTable/DataTable";

export function RecurringTaskRowContextMenu({ row, children }: RowContextMenuProps<RecurringTask>) {
	const [deleteAlertShown, setDeleteAlertShown] = useState<boolean>(false);

	const { selectionState } = useSelector((state: RootState) => state.recurringTask);

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

			<DeleteRecurringTaskAlert
				selectionState={selectionState}
				isOpen={deleteAlertShown}
				setOpen={setDeleteAlertShown}
			/>
		</ContextMenu>
	);
}
