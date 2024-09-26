import { AxiosResponse } from "axios";
import { Page } from "@apiModels/Page";
import { Task } from "@apiModels/task/Task";
import { authorizedAxiosApp } from "../Axios";
import { PageRequest } from "@apiModels/PageRequest";
import { DeleteTaskDto } from "@apiModels/task/DeleteTaskDto";
import { RecurringTask } from "@apiModels/task/RecurringTask";
import { EditRecurringJobDto } from "@apiModels/task/EditRecurringJobDto";

export class RecurringTaskService {
	static async getPage(body: PageRequest): Promise<AxiosResponse<Page<RecurringTask>>> {
		return authorizedAxiosApp.get(
			`/task/recurring/page?page=${body.page}&size=${body.size}&sort=${body.sort}`
		);
	}

	static async get(taskId: string): Promise<AxiosResponse<Task>> {
		return authorizedAxiosApp.get(`/task/${taskId}`);
	}

	static async edit(taskId: string, dto: EditRecurringJobDto): Promise<AxiosResponse<String>> {
		return authorizedAxiosApp.put(`/task/recurring/${taskId}`, dto);
	}

	static async delete(taskId: string): Promise<AxiosResponse<String>> {
		return authorizedAxiosApp.delete(`/task/recurring/${taskId}`);
	}

	static async deleteAll(dto: DeleteTaskDto): Promise<AxiosResponse<String>> {
		return authorizedAxiosApp.delete(`/task/recurring/delete`, { data: dto });
	}
}
