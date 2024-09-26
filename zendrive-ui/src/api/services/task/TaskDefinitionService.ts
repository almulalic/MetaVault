import { AxiosResponse } from "axios";
import { authorizedAxiosApp } from "@services/Axios";
import { TaskDefinition } from "../../models/task/TaskDefinition";

export class TaskDefinitionService {
	static async getAll(query: string): Promise<AxiosResponse<TaskDefinition[]>> {
		return authorizedAxiosApp.get(`/task/definition?query=${query}`);
	}

	static async get(id: string): Promise<AxiosResponse<TaskDefinition>> {
		return authorizedAxiosApp.get(`/task/definition/${id}`);
	}
}
