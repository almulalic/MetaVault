import { AxiosResponse } from "axios";
import { Page } from "@apiModels/Page";
import { authorizedAxiosApp } from "./Axios";
import { MetaFile } from "@apiModels/metafile";
import { FileTreeViewDTO } from "@apiModels/FileTreeView";
import { BulkGetDto } from "@apiModels/metafile/dto/BulkGetDto";
import { SearchRequest } from "@apiModels/metafile/dto/SearchRequest";
import { CreateTaskResponse } from "@apiModels/task/CreateTaskResponse";
import { DeleteTaskRequest } from "@apiModels/task/implementation/DeleteTask";
import { MetafileBulkDeleteDto } from "@apiModels/metafile/dto/MetafileBulkDeleteDto";
import { GenericMetafileDto } from "@apiModels/metafile/GenericMetafileDto";

export class MetafileService {
	static async getRoot(): Promise<AxiosResponse<FileTreeViewDTO>> {
		return authorizedAxiosApp.get(`metafile/tree/root`);
	}

	static async get(id: string): Promise<AxiosResponse<FileTreeViewDTO>> {
		return authorizedAxiosApp.get(`metafile/tree/${id}`);
	}

	static async exists(dto: GenericMetafileDto): Promise<AxiosResponse<MetaFile>> {
		return authorizedAxiosApp.post(`metafile/exists`, dto);
	}

	static async bulkGet(dto: BulkGetDto): Promise<AxiosResponse<MetaFile[]>> {
		return authorizedAxiosApp.post(`metafile/find/bulk`, dto);
	}

	static async bulkFileDelete(data: MetafileBulkDeleteDto): Promise<AxiosResponse> {
		return authorizedAxiosApp.post(`metafile/delete/file/bulk`, data);
	}

	static async fileDelete(id: string): Promise<AxiosResponse> {
		return authorizedAxiosApp.post(`metafile/delete/file/${id}`);
	}

	static async bulkFolderDelete(
		data: MetafileBulkDeleteDto
	): Promise<AxiosResponse<CreateTaskResponse<DeleteTaskRequest>[]>> {
		return authorizedAxiosApp.post(`metafile/delete/folder/bulk`, data);
	}

	static async folderDelete(
		id: string
	): Promise<AxiosResponse<CreateTaskResponse<DeleteTaskRequest>>> {
		return authorizedAxiosApp.post(`metafile/delete/folder/${id}`);
	}

	static async search(dto: SearchRequest): Promise<AxiosResponse<Page<MetaFile>>> {
		return authorizedAxiosApp.post(`metafile/search`, dto);
	}

	static async download(metafileId: string): Promise<AxiosResponse<Blob>> {
		return authorizedAxiosApp.get<Blob>(`metafile/download/${metafileId}`, {
			responseType: "blob"
		});
	}
}
