import { ErrorResponse } from "react-router-dom";

export class ApiResponse<Success, Error = ErrorResponse> {
	data: Success | null;
	error: Error | null;

	constructor(data: Success | null, error: Error | null) {
		this.data = data;
		this.error = error;
	}

	isSuccess(): boolean {
		return this.data !== null && this.data !== undefined;
	}

	isError(): boolean {
		return this.error !== null && this.error !== undefined;
	}
}
