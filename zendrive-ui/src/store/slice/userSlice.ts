import { Role } from "@apiModels/auth/Role";
import { LOCAL_STORAGE_KEYS } from "@constants/constants";
import { getParsedLocalStorageItem } from "@utils/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserFavoriteView } from "@apiModels/userFavorite/UserFavoriteView";

export interface UserSliceState {
	favorites: UserFavoriteView[];
	roles: Role[];
	detailsExpanded: boolean;
	recentFiles: string[];
	manualSelectShown: boolean;
	followLogOutput: boolean;
}

const { DETAILS_EXPANDED, FOLLOW_LOG_OUTPUT, RECET_FILES } = LOCAL_STORAGE_KEYS;

const initialState: UserSliceState = {
	favorites: [],
	roles: [],
	detailsExpanded: getParsedLocalStorageItem<boolean>(DETAILS_EXPANDED) || false,
	recentFiles: getParsedLocalStorageItem<string[]>(RECET_FILES) || [],
	manualSelectShown: false,
	followLogOutput: getParsedLocalStorageItem<boolean>(FOLLOW_LOG_OUTPUT) || false
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		set_user_favorites: (state: UserSliceState, data: PayloadAction<UserFavoriteView[]>) => {
			state.favorites = data.payload;
		},
		set_user_roles: (state: UserSliceState, data: PayloadAction<Role[]>) => {
			state.roles = data.payload;
		},
		set_details_expanded: (state: UserSliceState, data: PayloadAction<boolean>) => {
			state.detailsExpanded = data.payload;
			localStorage.setItem(DETAILS_EXPANDED, JSON.stringify(state.detailsExpanded));
		},
		update_recent_files: (state: UserSliceState, data: PayloadAction<string>) => {
			let recentFiles = state.recentFiles;
			let newId = data.payload;

			if (recentFiles.includes(newId)) {
				recentFiles = recentFiles.filter((x) => x !== newId);
			}

			if (recentFiles.length > 15) {
				recentFiles.shift();
			}

			recentFiles.push(newId);
			state.recentFiles = recentFiles.reverse();
			localStorage.setItem(RECET_FILES, JSON.stringify(state.recentFiles));
		},
		set_manual_select_showed: (state: UserSliceState, data: PayloadAction<boolean>) => {
			state.manualSelectShown = data.payload;
		},
		set_follow_log_output: (state: UserSliceState, data: PayloadAction<boolean>) => {
			state.followLogOutput = data.payload;
			localStorage.setItem(FOLLOW_LOG_OUTPUT, JSON.stringify(state.followLogOutput));
		}
	}
});

export const {
	set_user_favorites,
	set_user_roles,
	set_details_expanded,
	update_recent_files,
	set_manual_select_showed,
	set_follow_log_output
} = userSlice.actions;

export const userReducer = userSlice.reducer;
