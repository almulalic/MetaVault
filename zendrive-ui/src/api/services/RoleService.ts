import { AxiosResponse } from "axios";
import { authorizedAxiosApp } from "./Axios";
import { Role } from "@apiModels/auth/Role";

export class RoleService {
	static async getAll(): Promise<AxiosResponse<Role[]>> {
		return authorizedAxiosApp.get(`/role`);
	}

	static async getById(id: string): Promise<AxiosResponse<MetaFile>> {
		return authorizedAxiosApp.get(`/role/${id}`);
	}
}
