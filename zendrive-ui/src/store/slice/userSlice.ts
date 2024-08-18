import { Role } from "@apiModels/auth/Role";
import { createSlice } from "@reduxjs/toolkit";
import { UserFavoriteView } from "@apiModels/userFavorite/UserFavoriteView";
import { getParsedLocalStorageItem } from "@utils/utils";
import { LOCAL_STORAGE } from "@constants/constants";

export interface UserSliceState {
	favorites: UserFavoriteView[];
	roles: Role[];
	detailsExpanded: boolean;
	recentFiles: string[];
	manualSelectShown: boolean;
}

const { DETAILS_EXPANDED_KEY, RECET_FILES_KEY } = LOCAL_STORAGE;

const initialState: UserSliceState = {
	favorites: [],
	roles: [],
	detailsExpanded: getParsedLocalStorageItem<boolean>(DETAILS_EXPANDED_KEY) || false,
	recentFiles: getParsedLocalStorageItem<string[]>(RECET_FILES_KEY) || [],
	manualSelectShown: false
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		set_user_favorites: (state, data) => {
			state.favorites = data.payload;
		},
		set_user_roles: (state, data) => {
			state.roles = data.payload;
		},
		set_details_expanded: (state, data) => {
			state.detailsExpanded = data.payload;
			localStorage.setItem(DETAILS_EXPANDED_KEY, JSON.stringify(state.detailsExpanded));
		},
		update_recent_files: (state, data) => {
			let recentFiles = state.recentFiles;
			let newId = data.payload.id;

			if (recentFiles.includes(newId)) {
				recentFiles = recentFiles.filter((x) => x !== newId);
			}

			if (recentFiles.length > 15) {
				recentFiles.shift();
			}

			state.recentFiles = recentFiles;
			localStorage.setItem(RECET_FILES_KEY, JSON.stringify(state.recentFiles));
		},
		set_manual_select_showed: (state, data) => {
			state.manualSelectShown = data.payload;
		}
	}
});

export const {
	set_user_favorites,
	set_user_roles,
	set_details_expanded,
	update_recent_files,
	set_manual_select_showed
} = userSlice.actions;

export const userReducer = userSlice.reducer;
