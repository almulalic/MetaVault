import { FileStats } from "@apiModels/stats/FileStats";
import { MetaFile, MetafileConfig } from "@apiModels/index";
import { StorageType } from "@apiModels/metafile/StorageType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PermissionsInput {
	read: string[];
	write: string[];
	execute: string[];
}

export interface AddDirectoryState {
	currentStep: number;
	isLoading: boolean;
	metafileConfig: MetafileConfig;
	generatedMetafile: MetaFile | null;
	permissions: PermissionsInput;
}

const initialState: AddDirectoryState = {
	currentStep: 1,
	permissions: {
		read: [],
		write: [],
		execute: []
	},
	isLoading: false,
	generatedMetafile: null,
	metafileConfig: {
		inputPath: "",
		syncConfig: null,
		storageConfig: {
			type: StorageType.LOCAL,
			credentials: ""
		}
	}
};

const addDirectorySlice = createSlice({
	name: "addDirectory",
	initialState,
	reducers: {
		reset_add_directory_state: () => initialState,
		set_path: (state: AddDirectoryState, data: PayloadAction<string>) => {
			state.metafileConfig.inputPath = data.payload;
		},
		change_step: (state: AddDirectoryState, data: PayloadAction<number>) => {
			state.currentStep = data.payload;
		},
		next_step: (state: AddDirectoryState) => {
			state.currentStep = state.currentStep + 1;
		},
		previous_step: (state: AddDirectoryState) => {
			state.currentStep = state.currentStep - 1;
		},
		change_storage_type: (state: AddDirectoryState, data: PayloadAction<StorageType>) => {
			if (state.metafileConfig.storageConfig.type !== data.payload) {
				state.metafileConfig.inputPath = "";
				state.metafileConfig.storageConfig.type = data.payload;
			}
		},
		set_storage_crednetials: (state: AddDirectoryState, data: PayloadAction<string>) => {
			state.metafileConfig.storageConfig.credentials = data.payload;
		},
		change_permissions: (state: AddDirectoryState, data: PayloadAction<any>) => {
			state.permissions = { ...state.permissions, ...data.payload };
		},
		change_config: (state: AddDirectoryState, data: PayloadAction<MetafileConfig>) => {
			state.metafileConfig = { ...state.metafileConfig, ...data.payload };
		},
		set_add_form_loading: (state: AddDirectoryState, data: PayloadAction<boolean>) => {
			state.isLoading = data.payload;
		},
		set_generated_metafile: (state: AddDirectoryState, data: PayloadAction<MetaFile>) => {
			state.generatedMetafile = data.payload;
		}
	}
});

export const {
	reset_add_directory_state,
	set_path,
	change_storage_type,
	change_step,
	next_step,
	previous_step,
	set_add_form_loading,
	set_generated_metafile,
	change_permissions,
	change_config,
	set_storage_crednetials
} = addDirectorySlice.actions;

export const addDirectoryReducer = addDirectorySlice.reducer;
