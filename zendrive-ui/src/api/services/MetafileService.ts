import { AxiosResponse } from "axios";
import { Page } from "@apiModels/Page";
import { authorizedAxiosApp } from "./Axios";
import { MetaFile } from "@apiModels/metafile";
import { FileTreeViewDTO } from "@apiModels/FileTreeView";
import { BulkGetDto } from "@apiModels/metafile/dto/BulkGetDto";
import { SearchRequest } from "@apiModels/metafile/dto/SearchRequest";
import { GenericMetafileDto } from "@apiModels/metafile/GenericMetafileDto";
import { MetafileBulkDeleteDto } from "@apiModels/metafile/dto/delete/MetafileBulkDeleteDto";

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

	static async bulkDelete(dto: MetafileBulkDeleteDto): Promise<AxiosResponse> {
		return authorizedAxiosApp.delete(`metafile/bulk`, { data: dto });
	}

	static async delete(id: string): Promise<AxiosResponse<boolean>> {
		return authorizedAxiosApp.delete(`metafile/${id}/delete`);
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
