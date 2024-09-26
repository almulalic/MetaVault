import { RootState } from "@store/store";
import { useSelector } from "react-redux";
import { Separator } from "@elements/ui/separator";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { StorageType } from "@apiModels/metafile/StorageType";

export function FinalizeStep() {
	const { metafileConfig: config, permissions } = useSelector(
		(state: RootState) => state.addDirectory
	);

	return (
		<div className="flex flex-col gap-4 ">
			<div className="flex flex-col">
				<Heading type={HeadingType.FIVE}>Finalize</Heading>
				<p className="text-sm text-muted-foreground">
					If everything looks good, click "Submit" to scan the folder.
				</p>
			</div>

			<Separator />

			<div className="flex flex-col gap-3 text-gray-300">
				<div className="flex items-center gap-2">
					<span className="font-medium text-gray-100">Path:</span>
					<span>{config.inputPath}</span>
				</div>

				<div className="flex items-center gap-2">
					<span className="font-medium text-gray-100">Storage Type:</span>
					<span>{StorageType[config.storageConfig.type as keyof typeof StorageType]}</span>
				</div>

				<div className="flex items-center gap-2">
					<span className="font-medium text-gray-100">Read Permissions:</span>
					<span>{permissions.read.join(", ")}</span>
				</div>

				<div className="flex items-center gap-2">
					<span className="font-medium text-gray-100">Write Permissions:</span>
					<span>{permissions.write.join(", ")}</span>
				</div>

				<div className="flex items-center gap-2">
					<span className="font-medium text-gray-100">Execute Permissions:</span>
					<span>{permissions.execute.join(", ")}</span>
				</div>

				<div className="flex items-center gap-2">
					<span className="font-medium text-gray-100">Sync:</span>
					<span>{config.syncConfig ? "True" : "False"}</span>
				</div>

				{config.syncConfig && (
					<div>
						<div className="flex items-center gap-2">
							<span className="font-medium text-gray-100">Cron Expression:</span>
							<span>{config.syncConfig.cronExpression}</span>
						</div>

						<div className="flex items-center gap-2">
							<span className="font-medium text-gray-100">File conflict strategy:</span>
							<span>{config.syncConfig.fileConflictStrategy}</span>
						</div>

						<div className="flex items-center gap-2">
							<span className="font-medium text-gray-100">Max Concurrency:</span>
							<span>{config.syncConfig.maxConcurrency}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
