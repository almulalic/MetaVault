import { AxiosResponse } from "axios";
import { Task } from "@apiModels/task/Task";
import { authorizedAxiosApp } from "../Axios";
import { RunTaskDto } from "@apiModels/task/RunTaskDto";
import { DeleteTaskDto } from "@apiModels/task/DeleteTaskDto";
import { CreateTaskResponse } from "@apiModels/task/CreateTaskResponse";
import { ScanTaskParameters } from "@apiModels/task/parameters/ScanTaskParameters";
import { SyncTaskParameters } from "@apiModels/task/parameters/SyncTaskParameters";
import { DeleteTaskParameters } from "@apiModels/task/parameters/DeleteTaskParameters";

export class TaskService {
	static async get(taskId: string): Promise<AxiosResponse<Task>> {
		return authorizedAxiosApp.get(`/task/${taskId}`);
	}

	static async getRunningTasks(): Promise<AxiosResponse<Task[]>> {
		return authorizedAxiosApp.get(`/task/running`);
	}

	static async run<T>(dto: RunTaskDto<T>): Promise<AxiosResponse<CreateTaskResponse<T>>> {
		return authorizedAxiosApp.post(`/task/run`, dto);
	}

	static async runScan(
		dto: ScanTaskParameters
	): Promise<AxiosResponse<CreateTaskResponse<ScanTaskParameters>>> {
		return authorizedAxiosApp.post(`/task/run/scan`, dto);
	}

	static async runSync(
		dto: SyncTaskParameters
	): Promise<AxiosResponse<CreateTaskResponse<SyncTaskParameters>>> {
		return authorizedAxiosApp.post(`/task/run/sync`, dto);
	}

	static async runDelete(
		dto: DeleteTaskParameters
	): Promise<AxiosResponse<CreateTaskResponse<DeleteTaskParameters>>> {
		return authorizedAxiosApp.post(`/task/run/delete`, dto);
	}

	static async stop(taskId: string): Promise<AxiosResponse<boolean>> {
		return authorizedAxiosApp.post(`/task/${taskId}/stop`);
	}

	static async stopMany(dto: DeleteTaskDto): Promise<AxiosResponse<boolean>> {
		return authorizedAxiosApp.post(`/task/stop`, dto);
	}
}
