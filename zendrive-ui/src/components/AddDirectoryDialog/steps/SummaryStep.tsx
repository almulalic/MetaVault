import Heading, { HeadingType } from "@components/Heading/Heading";
import { RootState } from "@store/store";
import { useSelector } from "react-redux";
import { convertBytes } from "@utils/utils";

export function Summary() {
	const { scanCheckResponse } = useSelector((state: RootState) => state.addDirectory);

	if (!scanCheckResponse) {
		return;
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col">
				<Heading type={HeadingType.FIVE}>Summary</Heading>
				<p className="text-sm text-muted-foreground">
					Review the summary below. If everything looks good, proceed to the scan step.
				</p>
			</div>

			<ul className="list-disc [&>li]:mt-2">
				<li className="flex items-center">
					<span className="mr-2 text-blue-500">📄</span>
					<span>File count: {scanCheckResponse.fileCount}</span>
				</li>
				<li className="flex items-center ">
					<span className="mr-2 text-green-500">📁</span>
					<span>Directory count: {scanCheckResponse.dirCount}</span>
				</li>
				<li className="flex items-center ">
					<span className="mr-2 text-purple-500">📊</span>
					<span>
						Total size: {convertBytes(scanCheckResponse.totalSize)} ({scanCheckResponse.totalSize}{" "}
						B)
					</span>
				</li>
			</ul>
		</div>
	);
}
