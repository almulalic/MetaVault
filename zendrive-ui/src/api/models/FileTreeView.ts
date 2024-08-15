class FileTreeViewDTO {
	previousView: MetaFile[];
	current: MetaFile;
	currentView: MetaFile[];

	constructor(previousView: MetaFile[], current: MetaFile, currentView: MetaFile[]) {
		this.previousView = previousView;
		this.current = current;
		this.currentView = currentView;
	}
}
