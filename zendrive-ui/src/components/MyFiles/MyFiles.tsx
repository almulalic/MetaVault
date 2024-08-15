import { DateTime } from "luxon";
import { AxiosResponse } from "axios";
import { convertBytes } from "@utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { FileTextIcon, FolderIcon } from "lucide-react";
import PathBreadcrumb from "@components/Breadcrumb/Breadcrumb";
import { FilesTable } from "@components/FilesTable/FilesTable";
import { FileTreeService } from "../../api/services/FileTreeService";
import AddDirectoryDialog from "@components/AddDirectoryDialog/AddDirectoryDialog";
import { Checkbox } from "@components/ui/checkbox";
import { Button } from "@components/ui/button";

export const MyFiles = () => {
	// const location = useLocation();

	// useEffect(() => {
	// 	getFileTree(location.pathname.split("/").slice(-1)[0]);
	// }, [fileId]);

	const [showCheckbox, setShowCheckbox] = useState(true);

	const columns: ColumnDef<MetaFile>[] = useMemo(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
						aria-label="Select all"
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						onClick={(e) => e.stopPropagation()}
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
				header: () => <div className="flex items-center"></div>
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
				accessorKey: "lastModifiedDate",
				header: "Last Modified",
				cell: ({ row }) =>
					DateTime.fromMillis(row.original.lastModifiedDate).toFormat("dd-MM-yyyy HH:mm:ss")
			}
		],
		[]
	);

	const [current, setCurrent] = useState<MetaFile | null>(null);
	const [currentView, setCurrentView] = useState<MetaFile[]>([]);
	const [isLoading, setLoading] = useState<boolean>(true);
	const [breadcrumbs, setBreadcrumbs] = useState([] as any[]);

	async function getRootFile() {
		setLoading(true);

		const response: AxiosResponse<MetaFile> = await FileTreeService.getRootFile();

		if (!response) {
			return;
		}

		if (response!.status === 200) {
			setBreadcrumbs([{ id: response.data.id, label: "/" }]);
			await getFileTree(response.data.id);

			setLoading(false);
		}
	}

	async function getFileTree(fileId: string) {
		setLoading(true);

		const response: AxiosResponse<FileTreeViewDTO> = await FileTreeService.getFileTree(fileId);

		if (!response) {
			return;
		}

		if (response!.status === 200) {
			const current: MetaFile = response.data.current;

			setCurrentView(
				response.data.currentView.sort(
					(a: { children: any }, b: { children: any }) =>
						(a.children ? -1 : 1) - (b.children ? -1 : 1)
				)
			);
			setCurrent(current);
			window.history.replaceState(null, "Files", `/files/file/${current?.id}`);

			setLoading(false);
		}
	}

	useEffect(() => {
		async function init() {
			await getRootFile();
		}

		init();
	}, []);

	const goBack = () => {
		if (current?.name !== "root") {
			getFileTree(current?.previous!);
		}
	};

	const handleBreadcrumb = (item: MetaFile, index: number) => {
		getFileTree(item.id);
		setBreadcrumbs(breadcrumbs.slice(0, index + 1));
	};

	const handleItemClick = (item: MetaFile) => {
		if (item.children !== null) {
			if (item.name === "..") {
				goBack();

				breadcrumbs.pop();
				setBreadcrumbs(breadcrumbs);
			} else {
				getFileTree(item.id);

				breadcrumbs.push({ id: item.id, label: item.name });
				setBreadcrumbs(breadcrumbs);
			}
		} else {
			alert("Opening preview for: " + item.name);
		}
	};

	return (
		<div className="w-full max-w-full p-4 rounded">
			<h2 className="text-2xl font-semibold mb-4">My Files</h2>
			<div className="flex justify-end w-full mb-2">
				<AddDirectoryDialog />

				<Button onClick={() => setShowCheckbox(!showCheckbox)}>Toggle Checkbox</Button>
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
				onRowClick={handleItemClick}
				isLoading={isLoading}
			/>
		</div>
	);
};
