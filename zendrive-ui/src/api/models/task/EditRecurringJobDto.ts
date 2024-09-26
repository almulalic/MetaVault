import { SyncConfig } from "@apiModels/metafile/SyncConfig";

export class EditRecurringJobDto {
	syncConfig: SyncConfig;

	constructor(syncConfig: SyncConfig) {
		this.syncConfig = syncConfig;
	}
}
