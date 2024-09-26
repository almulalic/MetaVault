import { AxiosResponse } from "axios";
import { RootState } from "@store/store";
import { Toggle } from "@elements/ui/toggle";
import { MetaFile } from "@apiModels/metafile";
import { toast } from "@elements/ui/use-toast";
import { getMetafileIdFromUrl } from "@utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { FileTreeColumnDef } from "./components/Columns";
import { FileTreeViewDTO } from "@apiModels/FileTreeView";
import { MetafileService } from "@services/MetafileService";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import PathBreadcrumb from "@components/Breadcrumb/Breadcrumb";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import DetailsPanel from "@components/DetailsPanel/DetailsPanel";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PanelRightClose, PanelRightOpen, RefreshCw } from "lucide-react";
import AddDirectoryDialog from "@components/AddDirectoryDialog/AddDirectoryDialog";
import {
	SelectionState,
	set_files_loading,
	set_selection_state,
	set_active_metafile,
	set_current_metafile,
	set_current_as_selected
} from "@store/slice/fileTableSlice";
import {
	update_recent_files,
	set_details_expanded,
	set_manual_select_showed
} from "@store/slice/userSlice";
import { isFolder } from "@utils/metafile";
import { ErrorResponse } from "@apiModels/ErrorResponse";
import { DataTable } from "@elements/DataTable/DataTable";
import { Breadcrumb } from "@apiModels/metafile/Breadcrumb";
import RunTaskDialog from "@components/RunTaskDialog/RunTaskDialog";
import SelectBoxCheckedIcon from "@assets/icons/SelectBoxCheckedIcon";
import SelectBoxUncheckedIcon from "@assets/icons/SelectBoxUncheckedIcon";
import TableRowSkeleton from "@components/FilesTable/components/skeleton/TableRowSkeleton";
import FileTableRowContextMenu from "@components/FilesTable/components/contextMenu/FileTableRowContextMenu";

export const AllFiles = () => {
	const { fileId } = useParams();
	const { pathname, search } = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [isInitialLoad, setInitialLoad] = useState(false);

	const columns: ColumnDef<MetaFile>[] = useMemo<ColumnDef<MetaFile>[]>(
		() => FileTreeColumnDef,
		[]
	);

	function processView() {
		handleFileTreeChange(fileId || getMetafileIdFromUrl(pathname) || null);
	}

	useEffect(() => {
		processView();
		setInitialLoad(true);
	}, [pathname, search]);

	const { isLoading, selectionState, currentMetafile } = useSelector(
		(state: RootState) => state.fileTable
	);

	const { detailsExpanded, manualSelectShown } = useSelector((state: RootState) => state.user);

	const [currentView, setCurrentView] = useState<MetaFile[]>([]);
	const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

	const rootBreadcrumb = { id: "/", name: "/" };

	async function getFileTree(fileId: string | null): Promise<FileTreeViewDTO | null> {
		dispatch(set_files_loading(true));

		try {
			const response: AxiosResponse<FileTreeViewDTO> = fileId
				? await MetafileService.get(fileId)
				: await MetafileService.getRoot();

			return response.data;
		} catch (err) {
			if (err instanceof ErrorResponse) {
				toast({
					title: "Unexpected error occured!",
					description: err.message
				});

				if (err.message === "Metafile not found!") {
					navigate("/");
				}
			}

			return null;
		} finally {
			dispatch(set_files_loading(false));
		}
	}

	async function handleFileTreeChange(fileId: string | null) {
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

		currentMetafile.breadcrumbs.unshift(rootBreadcrumb);
		setBreadcrumbs(currentMetafile.breadcrumbs);

		dispatch(set_current_metafile(currentMetafile));
	}

	const handleBreadcrumb = (breadcrumb: Breadcrumb) => {
		navigate(`/files/tree/${breadcrumb.id !== "/" ? breadcrumb.id : ""}`);
	};

	function handleManualSelect(state: boolean) {
		dispatch(set_manual_select_showed(state));
	}

	const onRowBack = () => {
		if (currentMetafile?.name !== "root" && currentMetafile) {
			navigate(`/files/tree/${currentMetafile.previous}`);
			dispatch(update_recent_files(currentMetafile.previous));
		}
	};

	const onRowDoubleClick = (
		_: MouseEvent<HTMLTableRowElement>,
		table: Table<MetaFile>,
		row: Row<MetaFile>
	) => {
		const metafile: MetaFile = row.original;

		if (isFolder(metafile)) {
			table.toggleAllRowsSelected(false);
			navigate(`/files/tree/${metafile.id}`);
		} else {
			alert("Opening preview for: " + metafile.name);
		}

		if (metafile.name !== "root" && metafile.blobPath !== "/") {
			dispatch(update_recent_files(metafile.id));
		}
	};

	return (
		<div className="relative flex justify-between gap-8 w-full h-screen mt-4">
			<div
				className={`flex flex-col transition-transform duration-300 ease-in-out ${
					detailsExpanded ? "w-9/12" : "w-full"
				}`}
				style={{
					transition: "width 0.3s ease-in-out"
				}}
			>
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center justify-center gap-4">
						<Heading type={HeadingType.THREE} className="whitespace-nowrap m-0">
							Files
						</Heading>

						<RefreshCw
							className="w-4 h-4 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
							onClick={() => processView()}
						/>
					</div>

					<div className="flex items-center justify-end gap-2 w-full">
						<AddDirectoryDialog />

						<RunTaskDialog />

						<Toggle
							value="manualSelect"
							aria-label="Manual select"
							defaultPressed={manualSelectShown}
							onClick={() => handleManualSelect(!manualSelectShown)}
						>
							{manualSelectShown ? (
								<SelectBoxCheckedIcon className="h-6 w-6" />
							) : (
								<SelectBoxUncheckedIcon className="h-6 w-6" />
							)}
						</Toggle>

						<Toggle
							value="toggleExpanded"
							defaultPressed={detailsExpanded}
							aria-label={(detailsExpanded ? "Collapse" : "Expand") + " details"}
							onClick={() => dispatch(set_details_expanded(!detailsExpanded))}
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
						components={breadcrumbs.map((x) => ({
							label: x.name,
							onClick: () => handleBreadcrumb(x)
						}))}
					/>
				</div>

				<DataTable
					columns={columns}
					data={currentView || []}
					onRowBack={onRowBack}
					onRowDoubleClick={onRowDoubleClick}
					selectionState={selectionState}
					isInitialLoad={isInitialLoad}
					onSelectChange={(selectionState: SelectionState<MetaFile>) => {
						dispatch(set_selection_state(selectionState));

						if (selectionState.entities.length === 1) {
							dispatch(set_active_metafile(selectionState.entities[0]));
						}
					}}
					onRowDeselect={() => {
						dispatch(set_current_as_selected());
					}}
					isLoading={!isInitialLoad && isLoading}
					rowSkeleton={TableRowSkeleton}
					rowContextMenu={FileTableRowContextMenu}
				/>
			</div>

			<DetailsPanel />
		</div>
	);
};
