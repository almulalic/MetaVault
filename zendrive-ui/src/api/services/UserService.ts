import { AxiosResponse } from "axios";
import { publicAxiosApp } from "./Axios";

export class FileTreeService {
	static async getProjects(id: string): Promise<AxiosResponse<FileTreeViewDTO>> {
		return publicAxiosApp.get(`file/tree/${id}`);
	}
}
