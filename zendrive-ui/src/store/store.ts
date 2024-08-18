import { configureStore } from "@reduxjs/toolkit";

import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

import {
	authReducer,
	appReducer,
	addDirectoryReducer,
	fileTableReducer,
	userReducer
} from "./slice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		app: appReducer,
		addDirectory: addDirectoryReducer,
		fileTable: fileTableReducer,
		user: userReducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			}
		})
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
