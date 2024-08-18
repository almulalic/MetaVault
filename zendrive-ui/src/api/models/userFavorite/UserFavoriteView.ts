import { MetafileView } from "@apiModels/metafile/MetafileView";

export class UserFavoriteView {
	id: string;
	userId: number;
	metafileView: MetafileView;

	constructor(id: string, userId: number, metafileView: MetafileView) {
		this.id = id;
		this.userId = userId;
		this.metafileView = metafileView;
	}
}
