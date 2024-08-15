import { MetafilePermissions } from "@apiModels/Permissions";

export class LocalScanDto {
	path: string;
	destinationId?: string;
	permissions: MetafilePermissions;

	constructor(path: string, destinationId: string, permissions: MetafilePermissions) {
		this.path = path;
		this.destinationId = destinationId;
		this.permissions = permissions;
	}
}
