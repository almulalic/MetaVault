import { StorageConfig } from "@apiModels/metafile/StorageConfig";

export class StatsRequest {
	path: string;
	storageConfig: StorageConfig;

	constructor(path: string, storageConfig: StorageConfig) {
		this.path = path;
		this.storageConfig = storageConfig;
	}
}
