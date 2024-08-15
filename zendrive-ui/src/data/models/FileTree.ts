import { File } from "./File";
import { Folder } from "./Folder";

export class FileTree {
	public files: (File | Folder)[];
	public currentView?: (File | Folder)[];
	public currentFolder?: Folder;
	public previousFolder?: Folder;

	constructor(files: (File | Folder)[], folder: Folder) {
		this.files = files;
		this.currentFolder = folder;
		this.currentView = files.filter((x) => folder.children.includes(x.id));
		this.previousFolder = files.find((x) => x.id === folder.previous) as Folder;
	}

	public previous(): (File | Folder)[] {
		if (this.previousFolder) {
			this.currentFolder = this.previousFolder;
			this.currentView = this.files.filter((x) => this.currentFolder!.children.includes(x.id));
			this.previousFolder = this.files.find((x) => x.id === this.currentFolder!.previous) as Folder;

			return this.currentView;
		}

		return [];
	}

	public next(item: Folder): (File | Folder)[] {
		if (this.currentFolder?.children && item) {
			const next = this.currentFolder.children.find((x) => x === item.id);

			if (next) {
				this.previousFolder = this.currentFolder;
				this.currentFolder = this.files.find((x) => x.id === item.id) as Folder;
				this.currentView = this.files.filter((x) => this.currentFolder!.children.includes(x.id));

				return this.currentView;
			}
		}

		return [];
	}
}
