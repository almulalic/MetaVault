export class SearchRequest {
	query: string;
	page: number = 0;
	pageSize: number = 30;

	constructor(query: string, page: number, pageSize: number) {
		this.query = query;
		this.page = page;
		this.pageSize = pageSize;
	}
}
