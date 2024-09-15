import { AxiosResponse } from "axios";
import { User } from "@apiModels/user";
import { authorizedAxiosApp } from "./Axios";
import { UpdateUserDto } from "@apiModels/user/UpdateUserDto";
import { CreaterUserDto } from "@apiModels/user/CreateUserDto";

export class UserService {
	static async create(dto: CreaterUserDto): Promise<AxiosResponse<User>> {
		return authorizedAxiosApp.post(`user/create`, dto);
	}

	static async update(dto: UpdateUserDto): Promise<AxiosResponse<User>> {
		return authorizedAxiosApp.put(`user/update`, dto);
	}
}
