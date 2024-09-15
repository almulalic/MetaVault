import { RootState } from "@store/store";
import { Separator } from "@elements/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { StorageType } from "@apiModels/metafile/StorageType";
import { Tabs, TabsList, TabsTrigger } from "@elements/ui/tabs";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { change_storage_type } from "@store/slice/addDirectorySlice";

export function StorageTypeStep() {
	const dispatch = useDispatch();
	const { config } = useSelector((state: RootState) => state.addDirectory);

	const onStorageTypeChange = (type: any) => {
		dispatch(change_storage_type(type));
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col">
				<Heading type={HeadingType.FIVE}>Storage Type</Heading>
				<p className="text-sm text-muted-foreground">
					Storage type to be used for scanning. Can't be changed later on!
				</p>
			</div>

			<Separator />

			<Tabs defaultValue={config.storageConfig.type} onValueChange={onStorageTypeChange}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value={StorageType.LOCAL}>Local</TabsTrigger>
					<TabsTrigger value={StorageType.S3}>S3</TabsTrigger>
					<TabsTrigger value={StorageType.ZENODE} disabled={true}>
						ZenNode
					</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	);
}
