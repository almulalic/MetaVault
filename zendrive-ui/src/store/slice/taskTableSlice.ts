import { SelectionState } from "./fileTableSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskRunningStates } from "@apiModels/task/Task";

export interface TaskTableState {
	areTasksLoading: boolean;
	activeTask: Task | null;
	selectionState: SelectionState<Task>;
	runningTasks: Task[];
	pollInterval: number;
}

const initialState: TaskTableState = {
	selectionState: { start: 0, end: 0, entities: [] },
	areTasksLoading: true,
	activeTask: null,
	runningTasks: [],
	pollInterval: 5000
};

const taskTableSlice = createSlice({
	name: "taskTable",
	initialState,
	reducers: {
		reset_task_table_state: () => initialState,
		set_task_table_selection_state: (
			state: TaskTableState,
			data: PayloadAction<SelectionState<Task>>
		) => {
			state.selectionState = data.payload;
		},
		set_tasks_loading: (state: TaskTableState, data: PayloadAction<boolean>) => {
			state.areTasksLoading = data.payload;
		},
		set_running_tasks: (state: TaskTableState, data: PayloadAction<Task[]>) => {
			state.runningTasks = data.payload;

			if (data.payload.filter((x) => TaskRunningStates.includes(x.state)).length > 0) {
				state.pollInterval = 1500;
			} else {
				state.pollInterval = 5000;
			}
		},
		set_task_selection_state: (
			state: TaskTableState,
			data: PayloadAction<SelectionState<Task>>
		) => {
			state.selectionState = data.payload;
		}
	}
});

export const {
	set_tasks_loading,
	set_running_tasks,
	reset_task_table_state,
	set_task_selection_state,
	set_task_table_selection_state
} = taskTableSlice.actions;

export const taskTableReducer = taskTableSlice.reducer;
