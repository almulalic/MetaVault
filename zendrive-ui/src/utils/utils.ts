import { SelectionState } from "@store/slice";
import { Row } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertBytes(bytes: any) {
	if (bytes < 1024) {
		return bytes + " B";
	} else if (bytes < 1024 * 1024) {
		return (bytes / 1024).toFixed(2) + " KB";
	} else if (bytes < 1024 * 1024 * 1024) {
		return (bytes / (1024 * 1024)).toFixed(2) + " MB";
	} else if (bytes < 1024 * 1024 * 1024 * 1024) {
		return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
	} else {
		return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2) + " TB";
	}
}

export function getRowRange<T>(
	rows: Row<T>[],
	selectionState: SelectionState,
	currentId: number
): [Row<T>[], SelectionState] {
	return [
		rows.slice(
			Math.min(selectionState.start, currentId),
			Math.max(selectionState.start, currentId) + 1
		),
		{ start: selectionState.start, end: currentId }
	];
}

export function getLocalStorageItem(key: string): string | null {
	return localStorage.getItem(key);
}

export function getParsedLocalStorageItem<T>(key: string): T | null {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : null;
	} catch (err) {
		return null;
	}
}

export function getMetafileIdFromUrl(url: string): string {
	const parts = url.split("/");
	return parts[3];
}

export function generateRandomString(length = 4) {
	return Math.random().toString(36).substr(2, length);
}
