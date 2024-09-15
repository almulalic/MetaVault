import { AxiosResponse } from "axios";
import { User } from "@apiModels/User";
import { authorizedAxiosApp } from "./Axios";
import { EditUserDto } from "@apiModels/auth/dto/EditUserDto";

export class AdminService {
	static async searchUser(name: string): Promise<AxiosResponse<User[]>> {
		return authorizedAxiosApp.post(`admin/user/search`, { query: name });
	}

	static async editUser(dto: EditUserDto): Promise<AxiosResponse<User>> {
		return authorizedAxiosApp.put(`admin/user/edit`, dto);
	}
}
