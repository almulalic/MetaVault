import { Breadcrumb } from "./Breadcrumb";
import { MetafileConfig } from "./MetafileConfig";

export class MetaFile {
	id: string;
	name: string;
	contentType: string;
	size: number;
	lastModifiedMs: number;
	lastSyncMs: number;
	blobPath: string;
	contentSize: number;
	previous: string;
	children: string[];
	permissions: Permissions;
	breadcrumbs: Breadcrumb[];
	config: MetafileConfig;
	metadata: any;

	constructor(
		id: string,
		name: string,
		contentType: string,
		size: number,
		lastModifiedMs: number,
		lastSyncMs: number,
		blobPath: string,
		contentSize: number,
		previous: string,
		children: string[],
		permissions: Permissions,
		breadcrumbs: Breadcrumb[],
		config: MetafileConfig,
		metadata: any
	) {
		this.id = id;
		this.name = name;
		this.contentType = contentType;
		this.size = size;
		this.blobPath = blobPath;
		this.contentSize = contentSize;
		this.lastModifiedMs = lastModifiedMs;
		this.lastSyncMs = lastSyncMs;
		this.previous = previous;
		this.children = children;
		this.permissions = permissions;
		this.breadcrumbs = breadcrumbs;
		this.config = config;
		this.metadata = metadata;
	}

	isFolder() {
		return this.children !== null;
	}

	isFile() {
		return !this.isFolder();
	}
}
