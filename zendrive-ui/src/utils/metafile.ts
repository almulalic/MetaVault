import { MetaFile } from "@apiModels/metafile";

export function isFile(metafile: MetaFile): boolean {
	return metafile.children === null;
}

export function isFolder(metafile: MetaFile) {
	return !isFile(metafile);
}
