export class MetafileBulkDeleteDto {
	ids: string[];

	constructor(ids: string[]) {
		this.ids = ids;
	}
}
