import { RootState } from "@store/store";
import { Input } from "@elements/ui/input";
import { isFolder } from "@utils/metafile";
import { Toggle } from "@elements/ui/toggle";
import { useNavigate } from "react-router-dom";
import { set_search_query } from "@store/slice";
import { useDispatch, useSelector } from "react-redux";
import { MetaFile } from "@apiModels/metafile/MetaFile";
import { FilePage } from "@components/FilePage/FilePage";
import { DataTable } from "@elements/DataTable/DataTable";
import { SearchFileColumnDef } from "./components/Columns";
import { MetafileService } from "@services/MetafileService";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { set_details_expanded } from "@store/slice/userSlice";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import DetailsPanel from "@components/DetailsPanel/DetailsPanel";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SearchRequest } from "@apiModels/metafile/dto/SearchRequest";

export default function SearchFiles() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { detailsExpanded } = useSelector((state: RootState) => state.user);
	const { isLoading } = useSelector((state: RootState) => state.fileTable);

	const { searchQuery } = useSelector((state: RootState) => state.app);

	const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(15);

	const columns: ColumnDef<MetaFile>[] = useMemo<ColumnDef<MetaFile>[]>(
		() => SearchFileColumnDef,
		[]
	);

	const { data: searchPage, refetch } = useQuery({
		queryKey: ["search", currentPage],
		queryFn: async () =>
			(await MetafileService.search(new SearchRequest(searchQuery, currentPage - 1, pageSize)))
				.data,
		placeholderData: keepPreviousData
	});

	useEffect(() => {
		const params = new URLSearchParams();
		params.set("page", currentPage.toString());
		params.set("size", pageSize.toString());
		params.set("query", searchQuery);
		navigate(`?${params.toString()}`, { replace: true });
	}, [currentPage, pageSize, navigate]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [searchQuery]);

	useEffect(() => {
		refetch();
	}, [debouncedQuery, currentPage, pageSize]);

	if (!searchPage) {
		return;
	}

	function onSearchChange(e: any) {
		dispatch(set_search_query(e.target.value));
	}

	const handleRowClick = (
		_: MouseEvent<HTMLTableRowElement>,
		__: Table<MetaFile>,
		row: Row<MetaFile>
	) => {
		if (isFolder(row.original)) {
			navigate(`/files/tree/${row.original.id}`);
		} else {
			navigate(`/files/tree/${row.original.previous}`);
		}
	};

	return (
		<FilePage title="Search files">
			<div className="relative flex justify-between gap-8 w-full h-screen overflow-hidden mt-4">
				<div
					className={`flex flex-col space-y-8 space-x-1 transition-transform duration-300 ease-in-out ${
						detailsExpanded ? "w-9/12" : "w-full"
					}`}
					style={{
						transition: "width 0.3s ease-in-out"
					}}
				>
					<div className="flex justify-between items-center">
						<Heading type={HeadingType.THREE} className="whitespace-nowrap">
							Search
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

					<div>
						<Input
							type="text"
							placeholder="Search for metafiles..."
							className="w-full max-w-lg"
							value={searchQuery}
							onChange={onSearchChange}
						/>
					</div>

					<DataTable
						columns={columns}
						data={searchPage.content}
						onRowClick={handleRowClick}
						onRowBack={() => {}}
						isLoading={isLoading}
						isInitialLoad={false}
						pagination={{
							current: currentPage,
							totalPages: searchPage.totalPages,
							onPageChange: (page) => setCurrentPage(page)
						}}
					/>
				</div>

				<DetailsPanel />
			</div>
		</FilePage>
	);
}
