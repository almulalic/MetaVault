import { MetaFile } from "@apiModels/metafile";

export class UserFavoriteResponse {
	id: string;
	userId: string;
	metafile: MetaFile;

	constructor(id: string, userId: string, metafile: MetaFile) {
		this.id = id;
		this.userId = userId;
		this.metafile = metafile;
	}
}
