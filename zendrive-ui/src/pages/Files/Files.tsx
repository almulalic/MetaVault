import { AxiosResponse } from "axios";
import { RootState } from "@store/store";
import { useEffect, useMemo, useState } from "react";
import { Toggle } from "@elements/ui/toggle";
import { MetaFile } from "@apiModels/metafile";
import Search from "@components/Search/Search";
import { toast } from "@elements/ui/use-toast";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { getMetafileIdFromUrl } from "@utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { FileTreeColumnDef } from "./components/Columns";
import { FileTreeViewDTO } from "@apiModels/FileTreeView";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FileTreeService } from "@services/FileTreeService";
import PathBreadcrumb from "@components/Breadcrumb/Breadcrumb";
import { FilesTable } from "@components/FilesTable/FilesTable";
import { set_files_loading } from "@store/slice/fileTableSlice";
import DetailsPanel from "@components/DetailsPanel/DetailsPanel";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { LayoutList, ListTodo, PanelRightClose, PanelRightOpen } from "lucide-react";
import AddDirectoryDialog from "@components/AddDirectoryDialog/AddDirectoryDialog";
import {
	set_details_expanded,
	set_manual_select_showed,
	update_recent_files
} from "@store/slice/userSlice";

export const Files = () => {
	const { fileId } = useParams();
	const { pathname, search } = useLocation();

	const navigate = useNavigate();

	const dispatch = useDispatch();
	const columns: ColumnDef<MetaFile>[] = useMemo<ColumnDef<MetaFile>[]>(
		() => FileTreeColumnDef,
		[]
	);

	useEffect(() => {
		handleFileTreeChange(
			fileId || getMetafileIdFromUrl(pathname) || null,
			FileTreeDirection.DOWN,
			null
		);
	}, [pathname, search]);

	const { isLoading, currentMetafile } = useSelector((state: RootState) => state.fileTable);

	const { detailsExpanded, manualSelectShown } = useSelector((state: RootState) => state.user);

	const [currentView, setCurrentView] = useState<MetaFile[]>([]);
	let breadcrumbs: any[] = []; // TODO fix

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
		}
	}

	const handleBreadcrumb = (item: MetaFile, index: number) => {
		handleFileTreeChange(item.id, FileTreeDirection.JUMP, index);
	};

	const onRowBack = () => {
		if (currentMetafile?.name !== "root" && currentMetafile) {
			navigate(`/files/tree/${currentMetafile.previous}`);
			// handleFileTreeChange(currentMetafile.previous, FileTreeDirection.UP, null);
			dispatch(update_recent_files(currentMetafile.previous));
		}
	};

	const onRowClick = (table: Table<MetaFile>, _: Row<MetaFile> | null, metafile: MetaFile) => {
		if (metafile.children !== null) {
			table.toggleAllRowsSelected(false);
			// handleFileTreeChange(metafile.id, FileTreeDirection.DOWN, null);
			navigate(`/files/tree/${metafile.id}`);
		} else {
			alert("Opening preview for: " + metafile.name);
		}

		dispatch(update_recent_files(metafile.id));
	};

	function handleManualSelect(state: boolean) {
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
						Files
					</Heading>

					<Search />

					<div className="flex items-center justify-end gap-2 w-full">
						<AddDirectoryDialog />

						<Toggle
							value="manualSelect"
							aria-label="Manual select"
							defaultPressed={manualSelectShown}
							onClick={() => handleManualSelect(!manualSelectShown)}
						>
							{manualSelectShown ? <ListTodo /> : <LayoutList />}
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
						components={breadcrumbs.map((x, i) => ({
							label: x.label,
							onClick: () => handleBreadcrumb(x, i)
						}))}
					/>
				</div>

				<FilesTable
					columns={columns}
					data={currentView || []}
					onRowClick={onRowClick}
					onRowBack={onRowBack}
					isLoading={isLoading}
				/>
			</div>

			<DetailsPanel />
		</div>
	);
};
