export class UserFavoriteDto {
	metafiles: string[];

	constructor(metafiles: string[]) {
		this.metafiles = metafiles;
	}
}
