import { Breadcrumb } from "../Breadcrumb";

export class SearchItem {
	id: string;
	name: string;
	breadcrumbs: Breadcrumb[];

	constructor(name: string, id: string, breadcrumbs: Breadcrumb[]) {
		this.name = name;
		this.id = id;
		this.breadcrumbs = breadcrumbs;
	}
}
