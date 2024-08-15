import { createSlice } from "@reduxjs/toolkit";

export interface AppState {
	isDrawerOpen: boolean;
}

const initialState: AppState = {
	isDrawerOpen: false
};

const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		set_drawer_open: (state: any, data: any) => {
			state.isDrawerOpen = data.payload;
		}
	}
});

export const { set_drawer_open } = appSlice.actions;
export default appSlice.reducer;
