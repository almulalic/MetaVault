import { MetaFile } from "@apiModels/metafile";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectionState {
	start: number;
	end: number;
}

export interface FileTableState {
	isLoading: boolean;
	selectedMetafiles: MetaFile[];
	currentMetafile: MetaFile | null;
	activeMetafile: MetaFile | null;
	selectionState: SelectionState | null;
}

const initialState: FileTableState = {
	selectionState: { start: 0, end: 0 },
	isLoading: false,
	selectedMetafiles: [],
	activeMetafile: null,
	currentMetafile: null
};

const fileTableSlice = createSlice({
	name: "fileTable",
	initialState,
	reducers: {
		reset_file_table_state: () => initialState,
		set_selection_state: (state: FileTableState, data: PayloadAction<SelectionState | null>) => {
			state.selectionState = data.payload;
		},
		set_files_loading: (state: FileTableState, data: PayloadAction<boolean>) => {
			state.isLoading = data.payload;
		},
		set_selected_metafiles: (state: FileTableState, data: PayloadAction<MetaFile[]>) => {
			state.selectedMetafiles = data.payload;
		},
		set_current_metafile: (state: FileTableState, data: PayloadAction<MetaFile | null>) => {
			state.currentMetafile = data.payload;
			state.selectedMetafiles = [];
			state.activeMetafile = data.payload;
		},
		set_current_as_selected: (state: FileTableState) => {
			state.selectedMetafiles = state.currentMetafile ? [state.currentMetafile] : [];
		},
		set_active_metafile: (state: FileTableState, data: PayloadAction<MetaFile | null>) => {
			state.activeMetafile = data.payload;
		}
	}
});

export const {
	reset_file_table_state,
	set_selection_state,
	set_files_loading,
	set_selected_metafiles,
	set_current_metafile,
	set_current_as_selected,
	set_active_metafile
} = fileTableSlice.actions;

export const fileTableReducer = fileTableSlice.reducer;
