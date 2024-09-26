import { RootState } from "@store/store";
import { convertBytes } from "@utils/utils";
import { useQuery } from "@tanstack/react-query";
import { set_add_form_loading } from "@store/slice";
import { StatsService } from "@services/StatsService";
import { useDispatch, useSelector } from "react-redux";
import { StatsRequest } from "@apiModels/stats/StatsRequest";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { useEffect } from "react";

export function FileSummary() {
	const dispatch = useDispatch();
	const {
		isLoading,
		metafileConfig: { inputPath, storageConfig }
	} = useSelector((state: RootState) => state.addDirectory);

	if (!inputPath || !storageConfig) {
		return <div>Something went wrong!</div>;
	}

	const {
		isLoading: summaryLoading,
		data: summaryData,
		isError
	} = useQuery({
		queryKey: ["addFolderDialog", "summary", inputPath],
		queryFn: async () => (await StatsService.get(new StatsRequest(inputPath, storageConfig))).data
	});

	useEffect(() => {
		dispatch(set_add_form_loading(summaryLoading));
	}, [summaryLoading]);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col">
				<Heading type={HeadingType.FIVE}>Summary</Heading>
				<p className="text-sm text-muted-foreground">
					Review the summary below. If everything looks good, proceed to the scan step.
				</p>
			</div>

			{isError ? (
				<div>An error occured while generating </div>
			) : (
				<ul className="list-disc [&>li]:mt-2">
					<li className="flex items-center">
						<span className="mr-2 text-blue-500">📄</span>
						<span>File count: {isLoading ? <span>Loading...</span> : summaryData?.fileCount}</span>
					</li>
					<li className="flex items-center ">
						<span className="mr-2 text-green-500">📁</span>
						<span>
							Directory count: {isLoading ? <span>Loading...</span> : summaryData?.directoryCount}
						</span>
					</li>
					<li className="flex items-center ">
						<span className="mr-2 text-purple-500">📊</span>
						<span>
							Total size:{" "}
							{isLoading ? (
								<span>Loading...</span>
							) : (
								`${convertBytes(summaryData?.totalSize)} (${summaryData?.totalSize})`
							)}
						</span>
					</li>
				</ul>
			)}
		</div>
	);
}
