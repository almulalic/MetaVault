import { RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { change_selected_storage_type, StorageType } from "../../../store/addDirectorySlice";
import { Separator } from "@components/ui/separator";

export function StorageTypeStep() {
	const dispatch = useDispatch();
	const { storageType } = useSelector((state: RootState) => state.addDirectory);

	const onStorageTypeChange = (type: any) => {
		dispatch(change_selected_storage_type(type));
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

			<Tabs defaultValue={storageType.toString()} onValueChange={onStorageTypeChange}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value={StorageType.LOCAL.toString()}>Local</TabsTrigger>
					<TabsTrigger value={StorageType.ZENODE.toString()}>ZenNode</TabsTrigger>
					<TabsTrigger value={StorageType.AMAZON_S3.toString()}>Amazon S3</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	);
}
