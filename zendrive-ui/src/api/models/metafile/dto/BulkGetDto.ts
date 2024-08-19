export class BulkGetDto {
	metafileIds: string[];

	constructor(metafileIds: string[]) {
		this.metafileIds = metafileIds;
	}
}
