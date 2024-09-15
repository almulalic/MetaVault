import { Task, TaskRunningStates } from "@apiModels/task/Task";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectionState {
	start: number;
	end: number;
}

export interface TaskTableState {
	areTasksLoading: boolean;
	selectedTasks: Task[];
	activeTask: Task | null;
	selectionState: SelectionState | null;
	runningTasks: Task[];
	pollInterval: number;
}

const initialState: TaskTableState = {
	selectionState: { start: 0, end: 0 },
	areTasksLoading: false,
	selectedTasks: [],
	activeTask: null,
	runningTasks: [],
	pollInterval: 5000
};

const taskTableSlice = createSlice({
	name: "taskTable",
	initialState,
	reducers: {
		reset_task_table_state: () => initialState,
		set_selection_state: (state: TaskTableState, data: PayloadAction<SelectionState | null>) => {
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
		}
	}
});

export const { reset_task_table_state, set_selection_state, set_tasks_loading, set_running_tasks } =
	taskTableSlice.actions;

export const taskTableReducer = taskTableSlice.reducer;
