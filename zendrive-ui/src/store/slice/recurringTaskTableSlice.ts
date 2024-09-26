import { SelectionState } from "./fileTableSlice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecurringTask } from "@apiModels/task/RecurringTask";

export interface RecurringTaskTableState {
	areTasksLoading: boolean;
	activeTask: RecurringTask | null;
	selectionState: SelectionState<RecurringTask>;
	runningTasks: RecurringTask[];
	pollInterval: number;
}

const initialState: RecurringTaskTableState = {
	selectionState: { start: 0, end: 0, entities: [] },
	areTasksLoading: true,
	activeTask: null,
	runningTasks: [],
	pollInterval: 5000
};

const recurringTaskTableSlice = createSlice({
	name: "recurringTaskTable",
	initialState,
	reducers: {
		reset_recurring_task_table_state: () => initialState,
		set_recurring_task_table_selection_state: (
			state: RecurringTaskTableState,
			data: PayloadAction<SelectionState<RecurringTask>>
		) => {
			state.selectionState = data.payload;
		},
		set_recurring_tasks_loading: (state: RecurringTaskTableState, data: PayloadAction<boolean>) => {
			state.areTasksLoading = data.payload;
		},
		set_recurring_task_selection_state: (
			state: RecurringTaskTableState,
			data: PayloadAction<SelectionState<RecurringTask>>
		) => {
			state.selectionState = data.payload;
		}
	}
});

export const {
	set_recurring_tasks_loading,
	reset_recurring_task_table_state,
	set_recurring_task_selection_state,
	set_recurring_task_table_selection_state
} = recurringTaskTableSlice.actions;

export const recurringTaskReducer = recurringTaskTableSlice.reducer;
