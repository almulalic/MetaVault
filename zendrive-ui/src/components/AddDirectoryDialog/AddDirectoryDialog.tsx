import { Dialog, DialogContent, DialogTrigger } from "@components/ui/dialog";
import { useRef, useState } from "react";
import { Button } from "@components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
	change_permissions,
	change_step,
	change_storage_type,
	next_step,
	previous_step,
	reset,
	set_generated_metafile,
	set_loading
} from "../../store/addDirectorySlice";
import { LocalScanService } from "@services/LocalScanService";
import { toast } from "@components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { StorageTypeStep, RoleStepForm, Summary, FinalizeStep } from "./steps";
import { LocalStoreForm } from "./stores";

export default function AddDirectoryDialog() {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const LAST_STEP: number = 5;

	const {
		isLoading,
		currentStep,
		selectedStorageType,
		scanCheckResponse,
		generatedMetafile,
		selectedPermissions,
		permissions
	} = useSelector((state: RootState) => state.addDirectory);

	const [dialogOpen, setDialogOpen] = useState(false);
	const storeFromSubmitRef = useRef<HTMLInputElement>(null);
	const roleFromSubmitRef = useRef<HTMLInputElement>(null);

	async function submitAddDirectory() {
		dispatch(set_loading(true));

		const response: AxiosResponse<MetaFile> = await LocalScanService.scan({
			path: scanCheckResponse?.path!,
			permissions: permissions
		});

		if (response.status !== 200) {
			toast({
				title: "An unexpected error has occured!"
			});

			dispatch(set_loading(false));
			return;
		}

		dispatch(set_loading(false));
		dispatch(set_generated_metafile(response.data));
		dispatch(change_step(currentStep + 1));
	}

	function onPreviousClick() {
		switch (currentStep) {
			case 1:
				setDialogOpen(false);
				dispatch(reset());
				break;
			case 2:
				dispatch(previous_step());
				break;
			case 3:
				dispatch(previous_step());
				break;
			case 4:
				dispatch(change_permissions(selectedPermissions));
				dispatch(previous_step());
				break;
			case 5:
				dispatch(previous_step());
				break;
		}
	}

	async function onNextClick() {
		switch (currentStep) {
			case 1:
				dispatch(change_storage_type(selectedStorageType));
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
				await submitAddDirectory();
				setDialogOpen(false);
				navigate(`/files/file/${generatedMetafile?.id}`);
				window.location.reload();
				break;
		}
	}

	const handleDialogOpenChange = (open: boolean) => {
		setDialogOpen(open);

		if (!open) {
			dispatch(reset());
		}
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
			<DialogTrigger asChild>
				<Button>Add</Button>
			</DialogTrigger>

			<DialogContent className="flex flex-col">
				<div>
					{currentStep === 1 && <StorageTypeStep />}

					{currentStep === 2 && <LocalStoreForm submitRef={storeFromSubmitRef} />}

					{currentStep === 3 && scanCheckResponse && <Summary />}

					{currentStep === 4 && <RoleStepForm submitRef={roleFromSubmitRef} />}

					{currentStep === 5 && <FinalizeStep />}
				</div>

				<div className="w-full flex gap-4 mt-4">
					<Button
						variant="secondary"
						className="w-1/2"
						onClick={onPreviousClick}
						disabled={isLoading || currentStep === LAST_STEP}
					>
						{currentStep === 1 ? "Cancel" : "Previous"}
					</Button>
					<Button className="w-1/2" onClick={onNextClick} disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{currentStep === LAST_STEP ? "Submit" : "Next"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
