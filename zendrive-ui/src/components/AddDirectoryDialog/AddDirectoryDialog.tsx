import { AxiosResponse } from "axios";
import { useRef, useState } from "react";
import { LocalStoreForm } from "./stores";
import { Button } from "@elements/ui/button";
import { toast } from "@elements/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ConfigForm } from "./steps/ConfigForm";
import { FolderPlus, Loader2 } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AppDispatch, RootState } from "@store/store";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@elements/IconButton/IconButton";
import { Dialog, DialogContent } from "@elements/ui/dialog";
import { StorageTypeStep, RoleStepForm, FileSummary, FinalizeStep } from "./steps";
import {
	next_step,
	previous_step,
	reset_add_directory_state,
	set_add_form_loading
} from "@store/slice/addDirectorySlice";
import { S3StoreForm } from "./stores/S3StoreForm";
import { TaskService } from "@services/task/TaskService";
import { MetafileConfig } from "@apiModels/metafile";
import { StorageType } from "@apiModels/metafile/StorageType";
import { CreateTaskResponse } from "@apiModels/task/CreateTaskResponse";
import { ScanTaskParameters } from "@apiModels/task/parameters/ScanTaskParameters";

export default function AddDirectoryDialog() {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const LAST_STEP: number = 6;

	const {
		isLoading,
		currentStep,
		permissions,
		metafileConfig: config
	} = useSelector((state: RootState) => state.addDirectory);

	const [dialogOpen, setDialogOpen] = useState(false);

	const storeFromSubmitRef = useRef<HTMLInputElement>(null);
	const roleFromSubmitRef = useRef<HTMLInputElement>(null);
	const configFromSubmitRef = useRef<HTMLInputElement>(null);

	async function submitAddDirectory(): Promise<CreateTaskResponse<ScanTaskParameters> | null> {
		dispatch(set_add_form_loading(true));
		let currentConfig = config;

		if (config.storageConfig.type === StorageType.LOCAL) {
			if (!config.inputPath?.startsWith("file://")) {
				currentConfig = new MetafileConfig(
					`file://${config.inputPath}`,
					config.storageConfig,
					config.syncConfig
				);
			}
		}

		const response: AxiosResponse<CreateTaskResponse<ScanTaskParameters>> =
			await TaskService.runScan({
				permissions: permissions,
				config: currentConfig
			});

		if (response.status !== 200) {
			toast({
				title: "An unexpected error has occured!"
			});

			dispatch(set_add_form_loading(false));
			return null;
		}

		dispatch(set_add_form_loading(false));
		dispatch(reset_add_directory_state());

		return response.data;
	}

	function onPreviousClick() {
		switch (currentStep) {
			case 1:
				setDialogOpen(false);
				dispatch(reset_add_directory_state());
				break;
			default:
				dispatch(previous_step());
				break;
		}
	}

	async function onNextClick() {
		switch (currentStep) {
			case 1:
				dispatch(next_step());
				break;
			case 2:
				if (storeFromSubmitRef && storeFromSubmitRef.current) {
					storeFromSubmitRef.current.click();
				}
				break;
			case 3:
				dispatch(next_step());
				break;
			case 4:
				if (roleFromSubmitRef && roleFromSubmitRef.current) {
					roleFromSubmitRef.current.click();
				}
				break;
			case 5:
				if (configFromSubmitRef && configFromSubmitRef.current) {
					configFromSubmitRef.current.click();
				}
				break;
			case 6:
				const createTaskResponse: CreateTaskResponse<ScanTaskParameters> | null =
					await submitAddDirectory();
				setDialogOpen(false);

				if (createTaskResponse && createTaskResponse.id) {
					navigate(`/tasks/${createTaskResponse.id}`);
				}
				break;
		}
	}

	const handleDialogOpenChange = (open: boolean) => {
		setDialogOpen(open);

		if (!open) {
			dispatch(reset_add_directory_state());
		}
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
			<IconButton
				variant="ghost"
				tooltipContent="Add directory"
				onClick={() => handleDialogOpenChange(true)}
			>
				<FolderPlus className="w-6 h-6" />
			</IconButton>

			<DialogContent className="flex flex-col">
				<DialogTitle hidden>Add directory</DialogTitle>

				<div>
					{currentStep === 1 && <StorageTypeStep />}

					{currentStep === 2 &&
						(config.storageConfig.type === StorageType.LOCAL ? (
							<LocalStoreForm submitRef={storeFromSubmitRef} />
						) : config.storageConfig.type === StorageType.S3 ? (
							<S3StoreForm submitRef={storeFromSubmitRef} />
						) : (
							<div>Not supported</div>
						))}

					{currentStep === 3 && <FileSummary />}

					{currentStep === 4 && <RoleStepForm submitRef={roleFromSubmitRef} />}

					{currentStep === 5 && <ConfigForm submitRef={configFromSubmitRef} />}

					{currentStep === 6 && <FinalizeStep />}
				</div>

				<div className="w-full flex gap-4 mt-4 select-none">
					<Button
						variant="secondary"
						className="w-1/2"
						onClick={onPreviousClick}
						disabled={isLoading}
					>
						{currentStep === 1 ? "Cancel" : "Previous"}
					</Button>
					<Button className="w-1/2" onClick={onNextClick} disabled={isLoading}>
						{isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
						{currentStep === LAST_STEP ? "Submit" : "Next"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
