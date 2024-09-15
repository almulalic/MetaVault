import { Button } from "@elements/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@elements/ui/dropdown-menu";
import { Input } from "@elements/ui/input";
import { useState } from "react";

const SearchWithFilters = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilter, setSelectedFilter] = useState("All");

	const filters = ["All", "Images", "Videos", "Documents", "Audio"];

	return (
		<div className="flex items-center space-x-4">
			<Input
				placeholder="Search..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="w-full"
			/>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="flex items-center space-x-2">
						<span>{selectedFilter}</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{filters.map((filter) => (
						<DropdownMenuItem
							key={filter}
							onClick={() => setSelectedFilter(filter)}
							className={`cursor-pointer ${selectedFilter === filter ? "bg-gray-200" : ""}`}
						>
							{filter}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			<Button onClick={() => console.log(`Search for ${searchQuery} in ${selectedFilter}`)}>
				Search
			</Button>
		</div>
	);
};

export default SearchWithFilters;
