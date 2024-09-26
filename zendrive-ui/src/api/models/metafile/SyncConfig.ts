import { ConflictStrategy } from "@apiModels/task/ConflictStrategy";

export class SyncConfig {
	cronExpression: string;
	maxConcurrency: number;
	fileConflictStrategy: ConflictStrategy;

	constructor(
		cronExpression: string,
		maxConcurrency: number,
		fileConflictStrategy: ConflictStrategy
	) {
		this.cronExpression = cronExpression;
		this.maxConcurrency = maxConcurrency;
		this.fileConflictStrategy = fileConflictStrategy;
	}
}
