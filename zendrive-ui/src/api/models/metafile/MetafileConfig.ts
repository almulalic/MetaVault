import { SyncConfig } from "./SyncConfig";
import { StorageConfig } from "./StorageConfig";

export class MetafileConfig {
	inputPath: string | null;
	storageConfig: StorageConfig;
	syncConfig: SyncConfig | null;

	constructor(
		inputPath: string | null,
		storageConfig: StorageConfig,
		syncConfig: SyncConfig | null
	) {
		this.inputPath = inputPath;
		this.storageConfig = storageConfig;
		this.syncConfig = syncConfig;
	}
}
