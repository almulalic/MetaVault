import {
	Pagination as ShadcnPagination,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationContent,
	PaginationPrevious,
	PaginationEllipsis
} from "@elements/ui/pagination";
import { cn } from "@utils/utils";
import { useEffect, useState } from "react";

export interface PaginationProps {
	totalPages: number;
	current: number;
	onPreviousClick?: () => void;
	onNextClick?: () => void;
	onPageClick?: (index: number) => void;
	onPageChange?: (index: number) => void;
}

export function Pagination({
	totalPages,
	current,
	onPreviousClick,
	onNextClick,
	onPageClick,
	onPageChange
}: PaginationProps) {
	const [paginationNumbers, setPaginationNumbers] = useState<number[]>([]);

	useEffect(() => {
		const pagination: number[] = [];

		if (current > 1) {
			pagination.push(current - 1);
		} else if (totalPages > 1) {
			pagination.push(current + 2);
		}

		pagination.push(current);
		if (current < totalPages) pagination.push(current + 1);

		setPaginationNumbers(pagination.sort());
	}, [current, totalPages]);

	const handlePageChange = (page: number) => {
		if (page < 1 || page > totalPages) return;
		onPageChange?.(page);
	};

	const handlePreviousClick = () => {
		onPreviousClick?.();
		handlePageChange(current - 1);
	};

	const handleNextClick = () => {
		onNextClick?.();
		handlePageChange(current + 1);
	};

	const handlePageClick = (page: number) => {
		onPageClick?.(page);
		handlePageChange(page);
	};

	return (
		<ShadcnPagination>
			<PaginationContent>
				<PaginationItem className={cn("cursor-pointer")}>
					<PaginationPrevious onClick={handlePreviousClick} />
				</PaginationItem>

				{paginationNumbers.map((number) => (
					<PaginationItem key={number} className="cursor-pointer">
						<PaginationLink onClick={() => handlePageClick(number)} isActive={number === current}>
							{number}
						</PaginationLink>
					</PaginationItem>
				))}

				{/* {current < totalPages - 1 && (
					<PaginationItem className="cursor-pointer">
						<PaginationEllipsis />
					</PaginationItem>
				)} */}

				<PaginationItem className="cursor-pointer">
					<PaginationNext onClick={handleNextClick} />
				</PaginationItem>
			</PaginationContent>
		</ShadcnPagination>
	);
}
