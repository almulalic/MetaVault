import {
	CommandItem,
	CommandList,
	CommandEmpty,
	CommandInput,
	CommandDialog,
	CommandShortcut
} from "@elements/ui/command";
import { AxiosResponse } from "axios";
import { FileTextIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FileTreeService } from "@services/FileTreeService";
import { FormEvent, useCallback, useEffect, useState } from "react";

export default function Search() {
	const [query, setQuery] = useState("");
	const [searchResults, setSearchResults] = useState<SearchDTO[]>([]);

	const handleSearch = async (searchQuery: any) => {
		setLoading(true);
		console.log("Searching for:", searchQuery);
		const response: AxiosResponse<SearchDTO[]> = await FileTreeService.search(searchQuery);

		if (!response) {
			return;
		}

		if (response!.status === 200) {
			console.log(response.data);
			setSearchResults(response.data);
		}

		setLoading(false);
	};

	function debounce<T extends (...args: any[]) => Promise<void>>(
		func: T,
		delay: number
	): (...args: Parameters<T>) => void {
		let timeoutId: NodeJS.Timeout | undefined;

		return function (...args: Parameters<T>) {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(() => {
				func.apply(this, args);
			}, delay);
		};
	}

	const debouncedSearch = useCallback(
		debounce((nextValue: any) => handleSearch(nextValue), 500),
		[]
	);

	const handleSearchChange = (e: FormEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget;
		setQuery(value);
		debouncedSearch(value);
	};

	const [open, setOpen] = useState(false);
	const [isLoading, setLoading] = useState(false);

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

	const navigate = useNavigate();

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Type a command or search..." onInput={handleSearchChange} />

			<CommandList>
				{isLoading ? (
					<div className="p-4">Loading...</div>
				) : searchResults.length > 0 ? (
					searchResults.map((result: SearchDTO, i: number) => (
						<CommandItem
							key={i}
							id={i.toString()}
							value={result.id}
							onSelect={(value) => console.log(value)}
							className="cursor-pointer flex flex-col justify-start items-start gap-2"
						>
							<div className="flex gap-4">
								<FileTextIcon className="mr-2 h-4 w-4" />
								<span>{result.name}</span>
							</div>
							<CommandShortcut>{result.breadcrumbs.join("/")}</CommandShortcut>
						</CommandItem>
					))
				) : (
					<CommandEmpty>No results found.</CommandEmpty>
				)}
			</CommandList>
		</CommandDialog>
	);
}
