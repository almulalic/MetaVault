import { AxiosResponse } from "axios";
import { authorizedAxiosApp } from "./Axios";
import { FileStats } from "@apiModels/stats/FileStats";
import { StatsRequest } from "@apiModels/stats/StatsRequest";

export class StatsService {
	static async get(dto: StatsRequest): Promise<AxiosResponse<FileStats>> {
		return authorizedAxiosApp.post(`/stats`, dto);
	}
}
