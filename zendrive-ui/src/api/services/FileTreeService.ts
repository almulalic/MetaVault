import { AxiosResponse } from "axios";
import { authorizedAxiosApp } from "./Axios";

export class FileTreeService {
	static async getRootFile(): Promise<AxiosResponse<MetaFile>> {
		return authorizedAxiosApp.get(`file/tree/root`);
	}

	static async getFileTree(id: string): Promise<AxiosResponse<FileTreeViewDTO>> {
		return authorizedAxiosApp.get(`file/tree/${id}`);
	}

	static async deleteFile(id: string): Promise<AxiosResponse> {
		return authorizedAxiosApp.delete(`file/${id}`);
	}
}
