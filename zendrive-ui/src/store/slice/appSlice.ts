import { createSlice } from "@reduxjs/toolkit";

export interface AppState {}

const initialState: AppState = {};

const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {}
});

export const appReducer = appSlice.reducer;
