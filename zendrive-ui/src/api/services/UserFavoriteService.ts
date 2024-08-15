import { AxiosResponse } from "axios";
import { authorizedAxiosApp } from "./Axios";
import { UserFavoriteDto } from "../models/userFavorite/UserFavoriteDto";
import { UserFavoriteResponse } from "../models/userFavorite/UserFavoriteResponse";
import { UserFavorite } from "@apiModels/userFavorite/UserFavorite";

export class UserFavoriteService {
	static async getAll(): Promise<AxiosResponse<UserFavoriteResponse[]>> {
		return authorizedAxiosApp.get(`user/metafile/favorite`);
	}

	static async add(dto: UserFavoriteDto): Promise<AxiosResponse<UserFavorite>> {
		return authorizedAxiosApp.post(`user/metafile/favorite`, dto);
	}

	static async remove(dto: UserFavoriteDto): Promise<AxiosResponse<UserFavorite>> {
		return authorizedAxiosApp.post(`user/metafile/favorite/remove`, dto);
	}
}
