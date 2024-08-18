import { DateTime } from "luxon";
import { AxiosResponse } from "axios";
import { convertBytes, getMetafileIdFromUrl, getRowRange } from "@utils/utils";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import {
	FileTextIcon,
	FolderCheck,
	FolderIcon,
	ListTodo,
	PanelRightClose,
	PanelRightOpen,
	X
} from "lucide-react";
import PathBreadcrumb from "@components/Breadcrumb/Breadcrumb";
import { FilesTable } from "@components/FilesTable/FilesTable";
import { FileTreeService } from "../../api/services/FileTreeService";
import AddDirectoryDialog from "@components/AddDirectoryDialog/AddDirectoryDialog";
import { toast } from "@elements/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store/store";
import {
	set_current_metafile,
	set_selection_state,
	set_files_loading
} from "@store/slice/fileTableSlice";
import Heading, { HeadingType } from "@components/Heading/Heading";
import IconButton from "@elements/IconButton/IconButton";
import { MetaFile } from "@apiModels/metafile";
import { FileTreeViewDTO } from "@apiModels/FileTreeView";
import { useLocation, useParams } from "react-router-dom";
import {
	set_details_expanded,
	set_manual_select_showed,
	update_recent_files
} from "@store/slice/userSlice";
import { Checkbox } from "@elements/ui/checkbox";
import { Toggle } from "@elements/ui/toggle";

export const MyFiles = () => {
	const { fileId } = useParams();
	const { pathname, search } = useLocation();

	useEffect(() => {
		handleFileTreeChange(
			fileId || getMetafileIdFromUrl(pathname) || null,
			FileTreeDirection.DOWN,
			null
		);
	}, [pathname, search]);

	const dispatch = useDispatch();
	const { isLoading, selectedMetafiles, currentMetafile, activeMetafile } = useSelector(
		(state: RootState) => state.fileTable
	);

	const { detailsExpanded, manualSelectShown } = useSelector((state: RootState) => state.user);

	const columns: ColumnDef<MetaFile>[] = useMemo(
		() => [
			{
				id: "manualSelect",
				header: ({ table }) => (
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={(value: boolean) => {
							table.toggleAllPageRowsSelected(!!value);
						}}
						aria-label="Select all"
					/>
				),
				cell: ({ row, table }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						onClick={(e: React.MouseEvent) => {
							if (e.shiftKey) {
								// const { rows, rowsById } = table.getRowModel();

								try {
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
				id: "icon",
				enableResizing: false,
				cell: ({ row }) => (
					<div className="flex items-center">
						{row.original.children !== null ? (
							<FolderIcon className="h-8 w-8" />
						) : (
							<FileTextIcon className="h-8 w-8" />
						)}
					</div>
				),
				header: () => <div className="flex items-center"></div>,
				enableSorting: false
			},
			{
				accessorKey: "name",
				header: "Name"
			},

			{
				accessorKey: "size",
				header: "Size",
				cell: ({ row }) => convertBytes(row.original.size)
			},
			{
				accessorKey: "lastModifiedMs",
				header: "Last Modified",
				cell: ({ row }) =>
					DateTime.fromMillis(row.original.lastModifiedMs || 0).toFormat("dd-MM-yyyy HH:mm:ss")
			},
			{
				accessorKey: "lastSyncedMs",
				header: "Last Sync",
				cell: ({ row }) =>
					DateTime.fromMillis(row.original.lastSyncMs || 0).toFormat("dd-MM-yyyy HH:mm:ss")
			}
		],
		[]
	);

	const [currentView, setCurrentView] = useState<MetaFile[]>([]);
	const [breadcrumbs, setBreadcrumbs] = useState([] as any[]);

	enum FileTreeDirection {
		UP,
		DOWN,
		JUMP
	}

	async function getFileTree(fileId: string | null): Promise<FileTreeViewDTO | null> {
		dispatch(set_files_loading(true));

		const response: AxiosResponse<FileTreeViewDTO> = fileId
			? await FileTreeService.get(fileId)
			: await FileTreeService.getRoot();

		dispatch(set_files_loading(false));

		if (response!.status !== 200) {
			toast({
				title: "Unexpected error occured!",
				description: JSON.stringify(response.data)
			});

			return null;
		}

		return response.data;
	}

	async function handleFileTreeChange(
		fileId: string | null,
		direction: FileTreeDirection,
		index: number | null
	) {
		const fileTreeView: FileTreeViewDTO | null = await getFileTree(fileId);

		if (!fileTreeView) {
			return;
		}

		const currentMetafile: MetaFile = fileTreeView.current;

		setCurrentView(
			fileTreeView.currentView.sort(
				(a: { children: any }, b: { children: any }) =>
					(a.children ? -1 : 1) - (b.children ? -1 : 1)
			)
		);

		if (
			direction !== FileTreeDirection.DOWN ||
			!breadcrumbs.some((x) => x.id === currentMetafile.id)
		) {
			switch (direction) {
				case FileTreeDirection.UP:
					breadcrumbs.splice(-1);

					break;
				case FileTreeDirection.DOWN:
					breadcrumbs.push({ id: currentMetafile.id, label: currentMetafile.name });
					break;
				case FileTreeDirection.JUMP:
					breadcrumbs.splice(index! + 1);
					break;
			}

			setBreadcrumbs(breadcrumbs);
		}

		dispatch(set_selection_state(null));
		dispatch(update_recent_files(currentMetafile));
		dispatch(set_current_metafile(currentMetafile));
	}

	const onRowBack = () => {
		if (currentMetafile?.name !== "root") {
			handleFileTreeChange(currentMetafile?.previous!, FileTreeDirection.UP, null);
		}
	};

	const handleBreadcrumb = (item: MetaFile, index: number) => {
		handleFileTreeChange(item.id, FileTreeDirection.JUMP, index);
	};

	const handleRowClick = (table: Table<MetaFile>, _: Row<MetaFile> | null, metafile: MetaFile) => {
		if (metafile.children !== null) {
			handleFileTreeChange(metafile.id, FileTreeDirection.DOWN, null);
			table.toggleAllRowsSelected(false);
		} else {
			alert("Opening preview for: " + metafile.name);
		}
	};

	function handleSheetChange(state: boolean) {
		dispatch(set_details_expanded(state));
	}

	function handleManualSelect(state: boolean) {
		if (state) {
		} else {
		}

		dispatch(set_manual_select_showed(state));
	}

	return (
		<div className="relative flex justify-between gap-8 w-full h-screen overflow-hidden mt-4">
			<div
				className={`flex flex-col transition-transform duration-300 ease-in-out ${
					detailsExpanded ? "w-9/12" : "w-full"
				}`}
				style={{
					transition: "width 0.3s ease-in-out"
				}}
			>
				<div className="flex justify-between items-center mb-4">
					<Heading type={HeadingType.THREE} className="whitespace-nowrap">
						My Files
					</Heading>

					<div className="flex items-center justify-end gap-2 w-full">
						<AddDirectoryDialog />

						<Toggle
							value="manualSelect"
							aria-label="Manual select"
							onClick={() => handleManualSelect(!manualSelectShown)}
						>
							<ListTodo />
						</Toggle>
						<Toggle
							value="toggleExpanded"
							defaultPressed={detailsExpanded}
							aria-label={(detailsExpanded ? "Collapse" : "Expand") + " details"}
							onClick={() => handleSheetChange(!detailsExpanded)}
						>
							{detailsExpanded ? (
								<PanelRightClose className="h-6 w-6" />
							) : (
								<PanelRightOpen className="h-6 w-6" />
							)}
						</Toggle>
					</div>
				</div>

				<div className="flex mb-2">
					<PathBreadcrumb
						components={breadcrumbs.map((x, i) => ({
							label: x.label,
							onClick: () => handleBreadcrumb(x, i)
						}))}
					/>
				</div>

				<FilesTable
					columns={columns}
					data={currentView || []}
					onRowClick={handleRowClick}
					onRowBack={onRowBack}
					isLoading={isLoading}
				/>
			</div>

			<div
				className={`relative flex h-full bg-muted rounded-md box-border ${
					detailsExpanded ? "w-3/12" : "w-0"
				}`}
				style={{
					transition: "width 0.3s ease-in-out"
				}}
			>
				<div className="flex flex-col items-center w-full h-full p-4">
					<div className="flex justify-between items-center w-full">
						<div className="cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
							<Heading type={HeadingType.FIVE}>{activeMetafile?.name}</Heading>
						</div>

						<IconButton
							className="cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
							variant="ghost"
							onClick={() => handleSheetChange(false)}
						>
							<X className="h-6 w-6" />
							<span className="sr-only">Close</span>
						</IconButton>
					</div>
					<div>test</div>
				</div>
			</div>
		</div>
	);
};
