import Heading, { HeadingType } from "@components/Heading/Heading";
import { RootState } from "../../../store/index";
import { useSelector } from "react-redux";
import { Separator } from "@components/ui/separator";
import { StorageType } from "../../../store/addDirectorySlice";
// import { Progress } from "@components/ui/progress";
// import { useEffect, useState } from "react";

export function FinalizeStep() {
	// const [progress, setProgress] = useState(0);

	// useEffect(() => {
	// 	const timer = setTimeout(() => setProgress(100), 1000);
	// 	return () => clearTimeout(timer);
	// }, []);

	const { path, storageType, permissions } = useSelector((state: RootState) => state.addDirectory);

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
					<span>{path}</span>
				</div>

				<div className="flex items-center gap-2">
					<span className="font-medium text-gray-100">Storage Type:</span>
					<span>{StorageType[storageType]}</span>
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
			</div>
		</div>
	);
}
