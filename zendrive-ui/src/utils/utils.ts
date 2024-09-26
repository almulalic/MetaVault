import parser from "cron-parser";
import { AxiosResponse } from "axios";
import { twMerge } from "tailwind-merge";
import { Row } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { SelectionState } from "@store/slice";
import { toast } from "@elements/ui/use-toast";

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
	selectionState: SelectionState<T>,
	currentId: number
): [Row<T>[], SelectionState<T>] {
	rows = rows.slice(
		Math.min(selectionState.start, currentId),
		Math.max(selectionState.start, currentId) + 1
	);

	return [
		rows,
		{
			start: selectionState.start,
			end: currentId,
			entities: rows.map((x) => x.original)
		}
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

export function toCamelCase(str: string): string {
	return str.replace(/-./g, (match) => match.charAt(1).toUpperCase());
}

export function download(response: AxiosResponse<Blob>, defaultName: string) {
	try {
		if (response.status !== 200) {
			toast({
				title: "An error occured during download.",
				description: response.data.message || response.data.error
			});
			return;
		}

		const url = window.URL.createObjectURL(new Blob([response.data]));

		const contentDisposition: string = response.headers["Content-Disposition"];
		let fileName = defaultName;

		if (contentDisposition) {
			const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
			if (fileNameMatch && fileNameMatch[1]) {
				fileName = fileNameMatch[1];
			}
		} else {
			const fileNameHeader: string = response.headers["x-file-name"];

			if (fileNameHeader) {
				fileName = fileNameHeader;
			}
		}

		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", fileName);
		document.body.appendChild(link);
		link.click();

		link?.parentNode?.removeChild(link);
		window.URL.revokeObjectURL(url);
	} catch (error) {
		toast({ title: "Error downloading the file:", description: error });
	}
}

export function isValidJson(object: any): boolean {
	try {
		JSON.parse(object);
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

export function isValidCron(cronExpression: string): boolean {
	try {
		parser.parseExpression(cronExpression);
		return true;
	} catch (err) {
		console.error("Error parsing cron expression:", err);
		return false;
	}
}

export function calculateNextCronRun(cronExpression: string): number {
	try {
		return parser.parseExpression(cronExpression).next().getTime();
	} catch (err) {
		console.error("Error parsing cron expression:", err);
		return 0;
	}
}

export function camelCaseToWords(str: string): string {
	return str
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/^./, (firstChar) => firstChar.toUpperCase());
}
