import { AxiosResponse } from "axios";
import { Page } from "@apiModels/Page";
import { Input } from "@elements/ui/input";
import { FileIcon, FileTextIcon, FolderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MetaFile } from "@apiModels/metafile";
import { MetafileService } from "@services/MetafileService";
import { SearchRequest } from "@apiModels/metafile/dto/SearchRequest";
import { CommandItem, CommandList, CommandDialog, CommandShortcut } from "@elements/ui/command";
import { isFile, isFolder } from "@utils/metafile";

export default function Search() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
	const [isLoading, setLoading] = useState(true);
	const [searchData, setSearchData] = useState<MetaFile[]>([]);

	async function search(searchQuery: any): Promise<void> {
		setLoading(true);

		const response: AxiosResponse<Page<MetaFile>> = await MetafileService.search(
			new SearchRequest(searchQuery, 0, 15)
		);

		setLoading(false);

		if (!response) {
			setSearchData([]);
		}

		if (response.status === 200) {
			setSearchData(response.data.content);
		}
	}

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 750);

		return () => {
			clearTimeout(timer);
		};
	}, [searchQuery]);

	useEffect(() => {
		setLoading(true);
	}, [searchQuery]);

	useEffect(() => {
		search(searchQuery);
	}, [debouncedQuery]);

	return (
		<CommandDialog open={open} onOpenChange={setOpen} className="min-w-[65vw]">
			<Input
				placeholder="Type to search..."
				className="m-4 w-[80%]"
				onChange={(e) => setSearchQuery(e.target.value)}
				value={searchQuery}
			/>

			<CommandList className="h-full min-h-[280px]">
				{isLoading && <div className="p-4 text-sm">Searching...</div>}

				{searchData?.map((metafile: MetaFile, i: number) => (
					<CommandItem
						key={i}
						id={i.toString()}
						value={metafile.id}
						onSelect={() => {
							if (isFolder(metafile)) {
								navigate(`/files/tree/${metafile.id}`);
							} else {
								navigate(`/files/tree/${metafile.previous}`);
							}
							setOpen(false);
						}}
						className="cursor-pointer flex flex-col justify-start items-start gap-2"
					>
						<div className="flex gap-4">
							{isFile(metafile) ? (
								<FileTextIcon className="mr-2 h-4 w-4" />
							) : (
								<FolderIcon className="mr-2 h-4 w-4" />
							)}
							<span>{metafile.name}</span>
						</div>
						<CommandShortcut>{metafile.breadcrumbs.map((x) => x.name).join("/")}</CommandShortcut>
					</CommandItem>
				))}
			</CommandList>
		</CommandDialog>
	);
}
