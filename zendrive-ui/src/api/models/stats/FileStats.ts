export class FileStats {
	fileCount: number;
	directoryCount: number;
	totalSize: number;

	constructor(fileCount: number, directoryCount: number, totalSize: number) {
		this.fileCount = fileCount;
		this.directoryCount = directoryCount;
		this.totalSize = totalSize;
	}
}
