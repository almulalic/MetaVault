import { AxiosResponse } from "axios";
import { Page } from "@apiModels/Page";
import { RootState } from "@store/store";
import { Input } from "@elements/ui/input";
import { Toggle } from "@elements/ui/toggle";
import { useNavigate } from "react-router-dom";
import { set_files_loading, set_search_query } from "@store/slice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MetaFile } from "@apiModels/metafile/MetaFile";
import { FilePage } from "@components/FilePage/FilePage";
import { SearchFileColumnDef } from "./components/Columns";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { set_details_expanded } from "@store/slice/userSlice";
import { FilesTable } from "@components/FilesTable/FilesTable";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { MetafileService } from "@services/MetafileService";
import DetailsPanel from "@components/DetailsPanel/DetailsPanel";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { SearchRequest } from "@apiModels/metafile/dto/SearchRequest";
import { isFolder } from "@utils/metafile";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from "@elements/ui/pagination";
import { cn } from "@utils/utils";

export default function SearchFiles() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { detailsExpanded } = useSelector((state: RootState) => state.user);
	const { isLoading } = useSelector((state: RootState) => state.fileTable);

	const { searchQuery } = useSelector((state: RootState) => state.app);

	const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(15);
	const [paginationPages, setPaginationPages] = useState<number[]>([]);
	const [totalPages, setTotalPages] = useState(0);

	const [currentView, setCurrentView] = useState<MetaFile[]>([]);

	const columns: ColumnDef<MetaFile>[] = useMemo<ColumnDef<MetaFile>[]>(
		() => SearchFileColumnDef,
		[]
	);

	async function getMetafiles(searchQuery: string) {
		dispatch(set_files_loading(true));

		const response: AxiosResponse<Page<MetaFile>> = await MetafileService.search(
			new SearchRequest(searchQuery, currentPage - 1, pageSize)
		);

		if (response.status === 200) {
			setCurrentView(response.data.content);
			setTotalPages(response.data.totalPages);

			const pagesMax = response.data.totalPages;
			const pagination = [];

			if (currentPage - 1 > 0) {
				pagination.push(currentPage - 1);
			}

			pagination.push(currentPage);

			if (currentPage + 1 <= pagesMax) {
				pagination.push(currentPage + 1);
			}

			setTotalPages(pagesMax);
			setPaginationPages(pagination);
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

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [searchQuery]);

	useEffect(() => {
		getMetafiles(searchQuery);
	}, [debouncedQuery, currentPage, pageSize]);

	const onPreviousPage = () => {
		if (currentPage - 1 > 0) {
			setCurrentPage(currentPage - 1);
		}
	};

	const onNextPage = () => {
		if (currentPage + 1 <= totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const onPaginationNumberClick = (page: number) => {
		if (page <= totalPages) {
			setCurrentPage(page);
		}
	};

	function onSearchChange(e: any) {
		dispatch(set_search_query(e.target.value));
	}

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

					<FilesTable
						columns={columns}
						data={currentView}
						onRowClick={handleRowClick}
						onRowBack={() => {}}
						isLoading={isLoading}
					/>

					<Pagination>
						<PaginationContent>
							<PaginationItem
								className={cn(
									"cursor-pointer",
									isLoading || (currentPage === 1 && "cursor-not-allowed hover:bg-muted")
								)}
							>
								<PaginationPrevious onClick={onPreviousPage} />
							</PaginationItem>
							{paginationPages.map((number, index) => {
								return (
									<PaginationItem key={index}>
										<PaginationLink
											onClick={() => onPaginationNumberClick(number)}
											isActive={number == currentPage}
										>
											{number}
										</PaginationLink>
									</PaginationItem>
								);
							})}
							{paginationPages.length < totalPages && currentPage < totalPages - 2 && (
								<PaginationItem className="cursor-pointer">
									<PaginationEllipsis />
								</PaginationItem>
							)}
							<PaginationItem className="cursor-pointer">
								<PaginationNext onClick={onNextPage} />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>

				<DetailsPanel />
			</div>
		</FilePage>
	);
}
