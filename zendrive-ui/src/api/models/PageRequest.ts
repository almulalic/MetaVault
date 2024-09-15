export class PageRequest {
	page: number;
	size: number;
	sort: string;

	constructor(page: number, size: number, sort: string) {
		this.page = page;
		this.size = size;
		this.sort = sort;
	}
}
