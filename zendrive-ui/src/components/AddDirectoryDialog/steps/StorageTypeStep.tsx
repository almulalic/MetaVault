import { RootState } from "@store/store";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger } from "@elements/ui/tabs";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { change_storage_type, StorageTypeInput } from "@store/slice/addDirectorySlice";
import { Separator } from "@elements/ui/separator";

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

			<Tabs defaultValue={config.storageType.toString()} onValueChange={onStorageTypeChange}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value={StorageTypeInput.LOCAL.toString()}>Local</TabsTrigger>
					<TabsTrigger value={StorageTypeInput.ZENODE.toString()}>ZenNode</TabsTrigger>
					<TabsTrigger value={StorageTypeInput.AMAZON_S3.toString()}>Amazon S3</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	);
}
