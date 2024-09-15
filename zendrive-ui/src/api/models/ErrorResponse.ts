export class ErrorResponse {
	httpStatus: string;
	httpStatusCode: number;
	message: string;
	throwableName: string;
	timestamp: string;

	constructor(
		httpStatus: string,
		httpStatusCode: number,
		message: string,
		throwableName: string,
		timestamp: string
	) {
		this.httpStatus = httpStatus;
		this.httpStatusCode = httpStatusCode;
		this.message = message;
		this.throwableName = throwableName;
		this.timestamp = timestamp;
	}

	getFormattedMessage(): string {
		return `[${this.httpStatus}] ${this.message} (Code: ${this.httpStatusCode})`;
	}
}
