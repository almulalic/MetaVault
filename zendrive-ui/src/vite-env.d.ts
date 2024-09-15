/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_BASE_AUTH_URL: string;
	readonly VITE_APP_BASE_API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
