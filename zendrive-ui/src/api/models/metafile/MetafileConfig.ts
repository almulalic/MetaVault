import { StorageConfig } from "./StorageConfig";

export class MetafileConfig {
	sync: boolean;
	inputPath: string | null;
	storageConfig: StorageConfig;

	constructor(sync: boolean, inputPath: string | null, storageConfig: StorageConfig) {
		this.sync = sync;
		this.inputPath = inputPath;
		this.storageConfig = storageConfig;
	}
}
