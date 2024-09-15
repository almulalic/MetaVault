export class EditUserDto {
	id: string;
	roles: string[];
	enabled: boolean;
	locked: boolean;

	constructor(id: string, roles: string[], enabled: boolean, locked: boolean) {
		this.id = id;
		this.roles = roles;
		this.enabled = enabled;
		this.locked = locked;
	}
}
