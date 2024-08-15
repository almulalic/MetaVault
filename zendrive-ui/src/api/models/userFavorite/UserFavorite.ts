export class UserFavorite {
	id: string;
	userId: number;
	metafile: MetaFile;

	constructor(id: string, userId: number, metafile: MetaFile) {
		this.id = id;
		this.userId = userId;
		this.metafile = metafile;
	}
}
