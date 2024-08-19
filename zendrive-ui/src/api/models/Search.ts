class SearchDTO {
	id: string;
	name: string;
	breadcrumbs: string[];

	constructor(name: string, id: string, breadcrumbs: string[]) {
		this.name = name;
		this.id = id;
		this.breadcrumbs = breadcrumbs;
	}
}
