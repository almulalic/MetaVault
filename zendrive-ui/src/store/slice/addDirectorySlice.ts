import { MetaFile, MetafileConfig } from "@apiModels/index";
import { StorageConfig } from "@apiModels/metafile/StorageConfig";
import { StorageType } from "@apiModels/metafile/StorageType";
import { FileStats } from "@apiModels/stats/FileStats";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PermissionsInput {
	read: string[];
	write: string[];
	execute: string[];
}

export interface ConfigInput {
	sync: boolean;
	inputPath: string;
	storageConfig: StorageConfig;
}

export interface AddDirectoryState {
	currentStep: number;
	fileStats: FileStats | null;
	isLoading: boolean;
	config: MetafileConfig;
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
	fileStats: null,
	isLoading: false,
	generatedMetafile: null,
	config: {
		sync: false,
		inputPath: "",
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
			state.config.inputPath = data.payload;
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
			state.config.storageConfig.type = data.payload;
		},
		set_storage_crednetials: (state: AddDirectoryState, data: PayloadAction<string>) => {
			state.config.storageConfig.credentials = data.payload;
		},
		change_permissions: (state: AddDirectoryState, data: PayloadAction<any>) => {
			//TODO fix any
			state.permissions = { ...state.permissions, ...data.payload };
		},
		change_config: (state: AddDirectoryState, data: PayloadAction<MetafileConfig>) => {
			state.config = { ...state.config, ...data.payload };
		},
		set_file_stats: (state: AddDirectoryState, data: PayloadAction<FileStats>) => {
			state.fileStats = data.payload;
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
	set_file_stats,
	set_generated_metafile,
	change_permissions,
	change_config,
	set_storage_crednetials
} = addDirectorySlice.actions;

export const addDirectoryReducer = addDirectorySlice.reducer;
