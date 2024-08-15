import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import authSlice from "./authSlice";
import addDirectorySlice from "./addDirectorySlice";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER
} from "redux-persist";

const store = configureStore({
	reducer: {
		auth: authSlice,
		app: appSlice,
		addDirectory: addDirectorySlice
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
