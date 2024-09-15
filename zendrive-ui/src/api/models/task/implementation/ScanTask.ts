import { MetafileConfig, MetafilePermissions } from "@apiModels/metafile";

export class ScanTaskParameters {
	config: MetafileConfig;
	permissions: MetafilePermissions;

	constructor(config: MetafileConfig, permissions: MetafilePermissions) {
		this.config = config;
		this.permissions = permissions;
	}
}
