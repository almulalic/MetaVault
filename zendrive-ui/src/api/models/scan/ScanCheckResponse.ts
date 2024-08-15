class ScanCheckResponse {
	path: string;
	exists: boolean;
	fileCount: number;
	dirCount: number;
	totalSize: number;
	errorMessage: string;

	constructor(
		path: string,
		exists: boolean,
		fileCount: number,
		dirCount: number,
		totalSize: number,
		errorMessage: string
	) {
		this.path = path;
		this.exists = exists;
		this.fileCount = fileCount;
		this.dirCount = dirCount;
		this.totalSize = totalSize;
		this.errorMessage = errorMessage;
	}
}
