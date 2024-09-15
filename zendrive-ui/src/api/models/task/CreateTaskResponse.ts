export class CreateTaskResponse<T> {
	id: string;
	request: T;

	constructor(id: string, request: T) {
		this.id = id;
		this.request = request;
	}
}
