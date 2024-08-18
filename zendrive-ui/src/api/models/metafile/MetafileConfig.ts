import { StorageTypeInput } from "@store/slice/addDirectorySlice";

export class MetafileConfig {
	sync: boolean;
	inputPath: string | null;
	storageType: StorageTypeInput | null;

	constructor(sync: boolean, inputPath: string | null, storageType: StorageTypeInput | null) {
		this.sync = sync;
		this.inputPath = inputPath;
		this.storageType = storageType;
	}
}
