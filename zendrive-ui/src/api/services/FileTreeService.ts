import { AxiosResponse } from "axios";
import { authorizedAxiosApp } from "./Axios";
import { MetaFile } from "@apiModels/metafile";
import { FileTreeViewDTO } from "@apiModels/FileTreeView";
import { BulkGetDto } from "@apiModels/metafile/dto/BulkGetDto";
import { MetafileBulkDeleteDto } from "@apiModels/metafile/dto/MetafileBulkDeleteDto";

export class FileTreeService {
	static async getRoot(): Promise<AxiosResponse<FileTreeViewDTO>> {
		return authorizedAxiosApp.get(`file/tree/root`);
	}

	static async get(id: string): Promise<AxiosResponse<FileTreeViewDTO>> {
		return authorizedAxiosApp.get(`file/tree/${id}`);
	}

	static async bulkGet(dto: BulkGetDto): Promise<AxiosResponse<MetaFile[]>> {
		return authorizedAxiosApp.post(`file/find/bulk`, dto);
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
