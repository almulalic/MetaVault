export class DeleteTaskDto {
	ids: string[];

	constructor(ids: string[]) {
		this.ids = ids;
	}
}
