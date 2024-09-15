import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchSliceState {
	input: string;
}

const initialState: SearchSliceState = {
	input: ""
};

const searchSlice = createSlice({
	name: "search",
	initialState,
	reducers: {
		reset_search_state: () => initialState,
		set_input: (state: SearchSliceState, data: PayloadAction<string>) => {
			state.input = data.payload;
		}
	}
});

export const { reset_search_state, set_input } = searchSlice.actions;

export const searchReducer = searchSlice.reducer;
