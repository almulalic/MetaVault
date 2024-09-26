import { TaskData } from "./Task";

export class RecurringTask {
	id: string;
	version: number;
	data: TaskData;
	createdAt: number;

	constructor(id: string, version: number, data: TaskData, createdAt: number) {
		this.id = id;
		this.version = version;
		this.data = data;
		this.createdAt = createdAt;
	}
}
