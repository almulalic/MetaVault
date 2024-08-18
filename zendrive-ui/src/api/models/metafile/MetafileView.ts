export class MetafileView {
	id: string;
	name: string;
	breadcrumbs: string[];
	isFolder: boolean;
	size: number;

	constructor(id: string, name: string, breadcrumbs: string[], isFolder: boolean, size: number) {
		this.id = id;
		this.name = name;
		this.breadcrumbs = breadcrumbs;
		this.isFolder = isFolder;
		this.size = size;
	}
}
