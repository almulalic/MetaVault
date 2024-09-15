import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
	searchQuery: string;
}

const initialState: AppState = {
	searchQuery: ""
};

const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		set_search_query(state: AppState, data: PayloadAction<string>) {
			state.searchQuery = data.payload;
		}
	}
});

export const { set_search_query } = appSlice.actions;

export const appReducer = appSlice.reducer;
