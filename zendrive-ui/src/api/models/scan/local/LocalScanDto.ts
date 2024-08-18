import { MetafileConfig } from "@apiModels/metafile";
import { MetafilePermissions } from "@apiModels/metafile/MetafilePermissions";

export class LocalScanDto {
	destinationId?: string;
	permissions: MetafilePermissions;
	config: MetafileConfig;

	constructor(destinationId: string, permissions: MetafilePermissions, config: MetafileConfig) {
		this.destinationId = destinationId;
		this.permissions = permissions;
		this.config = config;
	}
}
