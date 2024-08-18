export class MetaFile {
	id: string;
	name: string;
	size: number;
	createdDate: string;
	lastModifiedMs: number;
	lastSyncMs: number;
	blobPath: string;
	contentSize: number;
	previous: string;
	children: string[];
	permissions: Permissions;

	constructor(
		id: string,
		name: string,
		size: number,
		createdDate: string,
		lastModifiedMs: number,
		lastSyncMs: number,
		blobPath: string,
		contentSize: number,
		previous: string,
		children: string[],
		permissions: Permissions
	) {
		this.id = id;
		this.name = name;
		this.size = size;
		this.createdDate = createdDate;
		this.blobPath = blobPath;
		this.contentSize = contentSize;
		this.lastModifiedMs = lastModifiedMs;
		this.lastSyncMs = lastSyncMs;
		this.previous = previous;
		this.children = children;
		this.permissions = permissions;
	}
}
