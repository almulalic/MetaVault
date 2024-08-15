import { MetafilePermissions } from "@apiModels/Permissions";
import { createSlice } from "@reduxjs/toolkit";

export enum StorageType {
	LOCAL,
	ZENODE,
	AMAZON_S3
}

export interface AddDirectoryState {
	path: string | null;
	currentStep: number;
	storageType: StorageType;
	permissions: { read: string[]; write: string[]; execute: string[] };
	scanCheckResponse: ScanCheckResponse | null;
	isLoading: boolean;
	generatedMetafile: MetaFile | null;
	selectedStorageType: StorageType | null;
	selectedPermissions: { read: string[]; write: string[]; execute: string[] };
}

const initialState: AddDirectoryState = {
	currentStep: 1,
	storageType: StorageType.LOCAL,
	permissions: {
		read: [],
		write: [],
		execute: []
	},
	path: null,
	scanCheckResponse: null,
	isLoading: false,
	generatedMetafile: null,
	selectedStorageType: null,
	selectedPermissions: {
		read: [],
		write: [],
		execute: []
	}
};

const addDirectorySlice = createSlice({
	name: "addDirectory",
	initialState,
	reducers: {
		reset: () => initialState,
		set_path: (state, data) => {
			state.path = data.payload;
		},
		change_step: (state, data) => {
			state.currentStep = data.payload;
		},
		next_step: (state) => {
			state.currentStep = state.currentStep + 1;
		},
		previous_step: (state) => {
			state.currentStep = state.currentStep - 1;
		},
		change_selected_storage_type: (state, data) => {
			state.selectedStorageType = data.payload;
		},
		change_storage_type: (state, data) => {
			if (!data.payload) {
				if (state.selectedStorageType) {
					state.storageType = state.selectedStorageType;
				}
			} else {
				state.storageType = data.payload;
			}
		},
		set_selected_permissions: (state, data) => {
			state.selectedPermissions = { ...state.selectedPermissions, ...data.payload };
		},
		change_permissions: (state, data) => {
			state.permissions = data.payload;
		},
		set_scan_check_response: (state, data) => {
			state.scanCheckResponse = data.payload;
		},
		set_loading: (state, data) => {
			state.isLoading = data.payload;
		},
		set_generated_metafile: (state, data) => {
			state.generatedMetafile = data.payload;
		}
	}
});

export const {
	reset,
	set_path,
	change_selected_storage_type,
	change_storage_type,
	change_step,
	next_step,
	previous_step,
	set_loading,
	set_scan_check_response,
	set_generated_metafile,
	set_selected_permissions,
	change_permissions
} = addDirectorySlice.actions;
export default addDirectorySlice.reducer;
