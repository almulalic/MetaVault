import { MetaFile } from "@apiModels/metafile";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectionState<T> {
	start: number;
	end: number;
	entities: T[];
}

export interface FileTableState {
	isLoading: boolean;
	currentMetafile: MetaFile | null;
	activeMetafile: MetaFile | null;
	selectionState: SelectionState<MetaFile>;
}

const initialState: FileTableState = {
	selectionState: { start: 0, end: 0, entities: [] },
	isLoading: false,
	activeMetafile: null,
	currentMetafile: null
};

const fileTableSlice = createSlice({
	name: "fileTable",
	initialState,
	reducers: {
		reset_file_table_state: () => initialState,
		set_selection_state: (state: FileTableState, data: PayloadAction<SelectionState<MetaFile>>) => {
			state.selectionState = data.payload;
		},
		set_files_loading: (state: FileTableState, data: PayloadAction<boolean>) => {
			state.isLoading = data.payload;
		},

		set_current_metafile: (state: FileTableState, data: PayloadAction<MetaFile | null>) => {
			state.currentMetafile = data.payload;
			state.selectionState.entities = [];
			state.activeMetafile = data.payload;
		},
		set_current_as_selected: (state: FileTableState) => {
			state.selectionState.entities = state.currentMetafile ? [state.currentMetafile] : [];
		},
		set_active_metafile: (state: FileTableState, data: PayloadAction<MetaFile | null>) => {
			state.activeMetafile = data.payload;
		}
	}
});

export const {
	set_files_loading,
	set_active_metafile,
	set_selection_state,
	set_current_metafile,
	reset_file_table_state,
	set_current_as_selected
} = fileTableSlice.actions;

export const fileTableReducer = fileTableSlice.reducer;
