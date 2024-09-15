export class Sort {
	empty: boolean;
	unsorted: boolean;
	sorted: boolean;

	constructor(empty: boolean, unsorted: boolean, sorted: boolean) {
		this.empty = empty;
		this.unsorted = unsorted;
		this.sorted = sorted;
	}
}

export class Pageable {
	pageNumber: number;
	pageSize: number;
	sort: Sort;
	offset: number;
	paged: boolean;
	unpaged: boolean;

	constructor(
		pageNumber: number,
		pageSize: number,
		sort: Sort,
		offset: number,
		paged: boolean,
		unpaged: boolean
	) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
		this.sort = sort;
		this.offset = offset;
		this.paged = paged;
		this.unpaged = unpaged;
	}
}

export class Page<T> {
	content: T[];
	pageable: Pageable;
	totalPages: number;
	totalElements: number;
	last: boolean;
	size: number;
	number: number;
	sort: Sort;
	numberOfElements: number;
	first: boolean;
	empty: boolean;

	constructor(
		content: T[],
		pageable: Pageable,
		totalPages: number,
		totalElements: number,
		last: boolean,
		size: number,
		number: number,
		sort: Sort,
		numberOfElements: number,
		first: boolean,
		empty: boolean
	) {
		this.content = content;
		this.pageable = pageable;
		this.totalPages = totalPages;
		this.totalElements = totalElements;
		this.last = last;
		this.size = size;
		this.number = number;
		this.sort = sort;
		this.numberOfElements = numberOfElements;
		this.first = first;
		this.empty = empty;
	}
}
