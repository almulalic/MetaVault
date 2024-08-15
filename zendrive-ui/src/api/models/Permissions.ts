export class MetafilePermissions {
	read: string[];
	write: string[];
	execute: string[];

	constructor(read: string[], write: string[], execute: string[]) {
		this.read = read;
		this.write = write;
		this.execute = execute;
	}
}
