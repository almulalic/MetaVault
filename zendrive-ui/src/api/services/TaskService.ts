import { AxiosResponse } from "axios";
import { Page } from "@apiModels/Page";
import { Task } from "@apiModels/task/Task";
import { authorizedAxiosApp } from "./Axios";
import { PageRequest } from "@apiModels/PageRequest";
import { RunTaskDto } from "@apiModels/task/RunTaskDto";
import { TaskDefinition } from "@apiModels/task/TaskDefinition";
import { CreateTaskResponse } from "@apiModels/task/CreateTaskResponse";
import { ScanTaskParameters } from "@apiModels/task/implementation/ScanTask";

export class TaskService {
	static async get(taskId: string): Promise<AxiosResponse<Task>> {
		return authorizedAxiosApp.get(`/task/${taskId}`);
	}

	static async run<T>(dto: RunTaskDto<T>): Promise<AxiosResponse<CreateTaskResponse<T>>> {
		return authorizedAxiosApp.post(`/task/run`, dto);
	}

	static async runScan(
		dto: ScanTaskParameters
	): Promise<AxiosResponse<CreateTaskResponse<ScanTaskParameters>>> {
		return authorizedAxiosApp.post(`/task/run/scan`, dto);
	}

	static async getDefinitions(query: string): Promise<AxiosResponse<TaskDefinition[]>> {
		return authorizedAxiosApp.get(`/task/definition?query=${query}`);
	}

	static async getDefinition(id: string): Promise<AxiosResponse<TaskDefinition>> {
		return authorizedAxiosApp.get(`/task/definition/${id}`);
	}

	static async getAll(body: PageRequest): Promise<AxiosResponse<Page<Task>>> {
		return authorizedAxiosApp.get(
			`/task/all?page=${body.page}&size=${body.size}&sort=${body.sort}`
		);
	}

	static async getRunningTasks(): Promise<AxiosResponse<Task[]>> {
		return authorizedAxiosApp.get(`/task/running`);
	}
}
