import { configureStore } from "@reduxjs/toolkit";

import {
	authReducer,
	appReducer,
	addDirectoryReducer,
	fileTableReducer,
	userReducer,
	taskTableReducer,
	runTaskReducer
} from "./slice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		app: appReducer,
		addDirectory: addDirectoryReducer,
		fileTable: fileTableReducer,
		user: userReducer,
		taskTable: taskTableReducer,
		runTask: runTaskReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
