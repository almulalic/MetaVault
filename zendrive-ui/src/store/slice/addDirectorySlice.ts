import { MetaFile } from "@apiModels/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PermissionsInput {
	read: string[];
	write: string[];
	execute: string[];
}

export interface ConfigInput {
	sync: boolean;
	inputPath: string;
	storageType: StorageTypeInput;
}

export enum StorageTypeInput {
	LOCAL,
	ZENODE,
	AMAZON_S3
}

export interface AddDirectoryState {
	currentStep: number;
	scanCheckResponse: ScanCheckResponse | null;
	isLoading: boolean;
	config: ConfigInput;
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
	scanCheckResponse: null,
	isLoading: false,
	generatedMetafile: null,
	config: {
		sync: false,
		inputPath: "",
		storageType: StorageTypeInput.LOCAL
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
		change_storage_type: (state: AddDirectoryState, data: PayloadAction<StorageTypeInput>) => {
			state.config.storageType = data.payload;
		},
		change_permissions: (state: AddDirectoryState, data: PayloadAction<any>) => {
			//TODO fix any
			state.permissions = { ...state.permissions, ...data.payload };
		},
		change_config: (state: AddDirectoryState, data: PayloadAction<ConfigInput>) => {
			state.config = { ...state.config, ...data.payload };
		},
		set_scan_check_response: (state: AddDirectoryState, data: PayloadAction<ScanCheckResponse>) => {
			state.scanCheckResponse = data.payload;
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
	set_scan_check_response,
	set_generated_metafile,
	change_permissions,
	change_config
} = addDirectorySlice.actions;

export const addDirectoryReducer = addDirectorySlice.reducer;
