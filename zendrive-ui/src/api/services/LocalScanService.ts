import { AxiosResponse } from "axios";
import { authorizedAxiosApp } from "./Axios";
import { LocalScanDto } from "@apiModels/scan/local/LocalScanDto";
import { CreateTaskResponse } from "@apiModels/task/CreateTaskResponse";
import { ScanTaskParameters } from "@apiModels/task/parameters/ScanTaskParameters";

export class LocalScanService {
	static async check(dto: LocalScanDto): Promise<AxiosResponse<ScanCheckResponse>> {
		return authorizedAxiosApp.post(`/file/scan/local/check`, dto);
	}

	static async scan(
		dto: LocalScanDto
	): Promise<AxiosResponse<CreateTaskResponse<ScanTaskParameters>>> {
		return authorizedAxiosApp.post(`/file/scan/local`, dto);
	}
}
