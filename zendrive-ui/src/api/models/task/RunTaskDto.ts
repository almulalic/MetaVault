export class RunTaskDto<T> {
	name: string;
	definitionId: string;
	parameters: T;

	constructor(name: string, definitionId: string, parameters: T) {
		this.name = name;
		this.definitionId = definitionId;
		this.parameters = parameters;
	}
}
