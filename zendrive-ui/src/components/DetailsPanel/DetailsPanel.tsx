import { DateTime } from "luxon";
import { ReactNode, useState } from "react";
import { RootState } from "@store/store";
import { Badge } from "@elements/ui/badge";
import { Tabs } from "@radix-ui/react-tabs";
import { cn, convertBytes } from "@utils/utils";
import { Button } from "@elements/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { DATE_TIME_FORMAT } from "@constants/constants";
import { set_details_expanded } from "@store/slice/userSlice";
import { TabsContent, TabsList, TabsTrigger } from "@elements/ui/tabs";
import { DownloadIcon, FileIcon, FolderIcon, Share2Icon } from "lucide-react";
import { download } from "../../utils/utils";
import { MetafileService } from "@services/MetafileService";
import { isFile, isFolder } from "@utils/metafile";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogHeader
} from "@elements/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

export interface DetailsPanelProps {
	handleChange?: (state: boolean) => void;
}

const badgeMap: Record<string, ReactNode> = {
	LOCAL: <Badge className="bg-blue-500">Local</Badge>,
	S3: <Badge className="bg-yellow-500">AWS S3</Badge>,
	ZENNODE: <Badge className="bg-teal-500">ZenNode</Badge>
};

export default function DetailsPanel({ handleChange }: DetailsPanelProps) {
	const { activeMetafile } = useSelector((state: RootState) => state.fileTable);
	const { detailsExpanded } = useSelector((state: RootState) => state.user);

	const dispatch = useDispatch();

	function internalHandleChange(state: boolean) {
		dispatch(set_details_expanded(state));
	}

	if (!activeMetafile) {
		return;
	}

	const InfoLine = ({ label, value }: { label: string; value: string }) => {
		return (
			<div className="flex justify-between">
				<span className="text-base text-gray-500">{label}</span>
				<span className="text-base text-ellipsis whitespace-nowrap overflow-hidden max-w-48">
					{value}
				</span>
			</div>
		);
	};

	const MetadataLine = ({ label, value }: { label: string; value: any }) => {
		const [isOpen, setOpen] = useState(false);

		console.log(label, value);
		return (
			<Dialog open={isOpen} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button className="w-full" variant="outline" onClick={() => setOpen(!isOpen)}>
						{label}
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{label}</DialogTitle>
					</DialogHeader>
					<DialogDescription hidden>Value of metadata key {label}</DialogDescription>
					<p>{typeof value === "string" ? value : JSON.stringify(value)}</p>
					<DialogFooter>
						<Button onClick={() => setOpen(!isOpen)}>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	};

	const handleDownload = async (metafileId: string) => {
		download(await MetafileService.download(metafileId), metafileId);
	};

	return (
		<div
			className={`flex bg-muted rounded-md box-border h-screen ${
				detailsExpanded ? "w-3/12" : "w-0"
			}`}
			style={{
				transition: "width 0.3s ease-in-out"
			}}
		>
			<div className="w-full max-w-sm h-screen overflow-y-auto bg-background">
				<div className="py-4 space-y-8">
					<div className="flex items-center space-x-4">
						<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
							{isFile(activeMetafile) ? (
								<FileIcon className="w-6 h-6 text-blue-600" />
							) : (
								<FolderIcon className="w-6 h-6 text-blue-600" />
							)}
						</div>
						<div className="flex-grow">
							<h2 className="text-xl font-semibold break-words">{activeMetafile.name}</h2>
							<p className="text-sm text-gray-500">{activeMetafile.contentType || "Folder"}</p>
						</div>
						{activeMetafile.config?.storageConfig &&
							badgeMap[activeMetafile.config.storageConfig.type]}
					</div>

					{activeMetafile.blobPath !== "/" && (
						<>
							<div className="flex space-x-2">
								<Button className="flex-1 cursor-pointer" size="sm">
									<Share2Icon className="w-4 h-4 mr-2" />
									Share
								</Button>
								<Button
									variant="outline"
									className={cn(
										"flex-1",
										isFolder(activeMetafile) ? "cursor-not-allowed" : "cursor-pointer"
									)}
									size="sm"
									disabled={isFolder(activeMetafile)}
									onClick={() => handleDownload(activeMetafile.id)}
								>
									<DownloadIcon className="w-4 h-4 mr-2" />
									Download
								</Button>
							</div>

							<div className="w-full">
								<Tabs className="w-full" defaultValue="info">
									<TabsList className="grid w-full grid-cols-2">
										<TabsTrigger value="info">Info</TabsTrigger>
										<TabsTrigger value="metadata">Metadata</TabsTrigger>
									</TabsList>

									<TabsContent value="info">
										<div className="flex flex-col text-lg">
											<div className="space-y-2">
												<InfoLine label="Id" value={activeMetafile.id} />

												<InfoLine
													label="Size"
													value={`${activeMetafile.size} (${convertBytes(
														activeMetafile.size
													)} bytes)`}
												/>

												{isFolder(activeMetafile) && (
													<InfoLine
														label="Children size"
														value={activeMetafile.children.length.toString()}
													/>
												)}

												<InfoLine
													label="Last Sync"
													value={DateTime.fromMillis(activeMetafile.lastSyncMs || 0).toFormat(
														DATE_TIME_FORMAT
													)}
												/>

												<InfoLine
													label="Modified"
													value={DateTime.fromMillis(activeMetafile.lastModifiedMs || 0).toFormat(
														DATE_TIME_FORMAT
													)}
												/>

												<InfoLine label="Blob Path" value={activeMetafile.blobPath} />
											</div>
										</div>
									</TabsContent>

									<TabsContent value="metadata">
										<div className={`tabs-content`}>
											<div className="flex flex-col space-y-2 p-4">
												{Object.entries(activeMetafile.metadata).map(([key, value]) => (
													<MetadataLine key={key} label={key} value={value} />
												))}
											</div>
										</div>
									</TabsContent>
								</Tabs>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
