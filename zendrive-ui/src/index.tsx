import App from "./App";
import React from "react";
import store from "@store/store";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { Toaster } from "@elements/ui/toaster";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@elements/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root")!);
const queryClient = new QueryClient();

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<Provider store={store}>
					<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
						<App />
						<Toaster />
					</ThemeProvider>
				</Provider>
			</QueryClientProvider>
		</BrowserRouter>
	</React.StrictMode>
);
