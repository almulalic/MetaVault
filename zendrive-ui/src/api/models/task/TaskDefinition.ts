export class TaskDefinition {
	id: string;
	name: string;
	createdBy: number;
	permissions: Permissions;
	handlerClasspath: string;
	requestClasspath: string;
	propertiesClasspath: string;
	createdAt: string;
	updatedAt: string;
	properties: Record<string, any>;

	constructor(
		id: string,
		name: string,
		createdBy: number,
		permissions: Permissions,
		handlerClasspath: string,
		requestClasspath: string,
		propertiesClasspath: string,
		createdAt: string,
		updatedAt: string,
		properties: Record<string, any>
	) {
		this.id = id;
		this.name = name;
		this.createdBy = createdBy;
		this.permissions = permissions;
		this.handlerClasspath = handlerClasspath;
		this.requestClasspath = requestClasspath;
		this.propertiesClasspath = propertiesClasspath;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.properties = properties;
	}
}
