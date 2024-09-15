import { AxiosResponse } from "axios";
import { RootState } from "@store/store";
import { Toggle } from "@elements/ui/toggle";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MetaFile } from "@apiModels/metafile/MetaFile";
import { FilePage } from "@components/FilePage/FilePage";
import { RecentFileColumnDef } from "./components/Columns";
import { MetafileService } from "@services/MetafileService";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { set_details_expanded } from "@store/slice/userSlice";
import { FilesTable } from "@components/FilesTable/FilesTable";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { BulkGetDto } from "@apiModels/metafile/dto/BulkGetDto";
import DetailsPanel from "@components/DetailsPanel/DetailsPanel";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { set_files_loading } from "@store/slice";
import { isFolder } from "@utils/metafile";

export default function RecentFiles() {
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const { recentFiles, detailsExpanded } = useSelector((state: RootState) => state.user);
	const { isLoading } = useSelector((state: RootState) => state.fileTable);

	const [currentView, setCurrentView] = useState<MetaFile[]>([]);

	const columns: ColumnDef<MetaFile>[] = useMemo<ColumnDef<MetaFile>[]>(
		() => RecentFileColumnDef,
		[]
	);

	useEffect(() => {
		getMetafiles(recentFiles);
	}, []);

	async function getMetafiles(ids: string[]) {
		dispatch(set_files_loading(true));

		const response: AxiosResponse<MetaFile[]> = await MetafileService.bulkGet(new BulkGetDto(ids));

		if (response.status === 200) {
			setCurrentView(response.data);
		}

		dispatch(set_files_loading(false));
	}

	const handleRowClick = (_: Table<MetaFile>, __: Row<MetaFile> | null, metafile: MetaFile) => {
		if (isFolder(metafile)) {
			navigate(`/files/tree/${metafile.id}`);
		} else {
			alert("Opening preview for: " + metafile.name);
		}
	};

	return (
		<FilePage title="Recent files">
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
							Recent Files
						</Heading>

						<div className="flex items-center justify-end gap-2 w-full">
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

					<FilesTable
						columns={columns}
						data={currentView}
						onRowClick={handleRowClick}
						onRowBack={() => {}}
						isLoading={isLoading}
					/>
				</div>

				<DetailsPanel />
			</div>
		</FilePage>
	);
}
