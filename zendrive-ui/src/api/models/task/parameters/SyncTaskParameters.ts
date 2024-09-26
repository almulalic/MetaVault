import { ConflictStrategy } from "../ConflictStrategy";

export class SyncTaskParameters {
	directoryId: string;
	fileConflictStrategy: ConflictStrategy;

	constructor(directoryId: string, fileConflictStrategy: ConflictStrategy) {
		this.directoryId = directoryId;
		this.fileConflictStrategy = fileConflictStrategy;
	}
}
