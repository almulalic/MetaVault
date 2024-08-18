import { AxiosResponse } from "axios";
import { authorizedAxiosApp } from "./Axios";
import { FileTreeViewDTO } from "@apiModels/FileTreeView";
import { MetafileBulkDeleteDto } from "@apiModels/metafile/dto/MetafileBulkDeleteDto";

export class FileTreeService {
	static async getRoot(): Promise<AxiosResponse<FileTreeViewDTO>> {
		return authorizedAxiosApp.get(`file/tree/root`);
	}

	static async get(id: string): Promise<AxiosResponse<FileTreeViewDTO>> {
		return authorizedAxiosApp.get(`file/tree/${id}`);
	}

	static async bulkDelete(data: MetafileBulkDeleteDto): Promise<AxiosResponse> {
		return authorizedAxiosApp.post(`file/delete/bulk`, data);
	}

	static async delete(id: string): Promise<AxiosResponse> {
		return authorizedAxiosApp.delete(`file/delete/${id}`);
	}
	static async search(searchText: string): Promise<AxiosResponse<SearchDTO[]>> {
		return authorizedAxiosApp.get(`file/search?searchText=${searchText}`);
	}
}
