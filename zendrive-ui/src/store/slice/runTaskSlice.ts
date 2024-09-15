import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RunTaskState {
	currentStep: number;
	isLoading: boolean;
}

const initialState: RunTaskState = {
	currentStep: 1,
	isLoading: false
};

const runTaskSlice = createSlice({
	name: "runTask",
	initialState,
	reducers: {
		reset_run_task_state: () => initialState,
		set_run_task_loading: (state: RunTaskState, data: PayloadAction<boolean>) => {
			state.isLoading = data.payload;
		},
		change_run_task_step: (state: RunTaskState, data: PayloadAction<number>) => {
			state.currentStep = data.payload;
		},
		next_run_task_step: (state: RunTaskState) => {
			state.currentStep = state.currentStep + 1;
		},
		previous_run_task_step: (state: RunTaskState) => {
			state.currentStep = state.currentStep - 1;
		}
	}
});

export const {
	set_run_task_loading,
	reset_run_task_state,
	change_run_task_step,
	next_run_task_step,
	previous_run_task_step
} = runTaskSlice.actions;

export const runTaskReducer = runTaskSlice.reducer;
