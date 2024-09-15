export class StorageConfig {
	type: string;
	credentials: string;

	constructor(type: string, credentials: string) {
		this.type = type;
		this.credentials = credentials;
	}
}
