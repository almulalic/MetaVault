import { AxiosResponse } from "axios";
import { Page } from "@apiModels/Page";
import { Task } from "@apiModels/task/Task";
import { authorizedAxiosApp } from "../Axios";
import { PageRequest } from "@apiModels/PageRequest";

export class TasksService {
	static async getPage(body: PageRequest): Promise<AxiosResponse<Page<Task>>> {
		return authorizedAxiosApp.get(
			`/tasks/page?page=${body.page}&size=${body.size}&sort=${body.sort}`
		);
	}
}
