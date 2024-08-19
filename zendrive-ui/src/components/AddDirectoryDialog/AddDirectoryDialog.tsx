import { Dialog, DialogContent } from "@elements/ui/dialog";
import { useRef, useState } from "react";
import { Button } from "@elements/ui/button";
import { useDispatch, useSelector } from "react-redux";

import { LocalScanService } from "@services/LocalScanService";
import { toast } from "@elements/ui/use-toast";
import { FolderPlus, Loader2 } from "lucide-react";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { StorageTypeStep, RoleStepForm, Summary, FinalizeStep } from "./steps";
import { LocalStoreForm } from "./stores";
import IconButton from "@elements/IconButton/IconButton";
import { DialogTitle } from "@radix-ui/react-dialog";
import { MetaFile } from "@apiModels/metafile";
import { ConfigForm } from "./steps/ConfigForm";
import { AppDispatch, RootState } from "@store/store";
import {
	change_step,
	next_step,
	previous_step,
	reset_add_directory_state,
	set_add_form_loading
} from "@store/slice/addDirectorySlice";

export default function AddDirectoryDialog() {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const LAST_STEP: number = 6;

	const { isLoading, currentStep, scanCheckResponse, permissions, config } = useSelector(
		(state: RootState) => state.addDirectory
	);

	const [dialogOpen, setDialogOpen] = useState(false);

	const storeFromSubmitRef = useRef<HTMLInputElement>(null);
	const roleFromSubmitRef = useRef<HTMLInputElement>(null);
	const configFromSubmitRef = useRef<HTMLInputElement>(null);

	async function submitAddDirectory(): Promise<MetaFile | null> {
		dispatch(set_add_form_loading(true));

		const response: AxiosResponse<MetaFile> = await LocalScanService.scan({
			permissions: permissions,
			config: config
		});

		if (response.status !== 200) {
			toast({
				title: "An unexpected error has occured!"
			});

			dispatch(set_add_form_loading(false));
			return null;
		}

		dispatch(set_add_form_loading(false));
		dispatch(change_step(currentStep + 1));

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
				const metafile = await submitAddDirectory();
				setDialogOpen(false);

				if (metafile) {
					navigate(`/files/tree/${metafile.id}`);
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

					{currentStep === 2 && <LocalStoreForm submitRef={storeFromSubmitRef} />}

					{currentStep === 3 && scanCheckResponse && <Summary />}

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
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{currentStep === LAST_STEP ? "Submit" : "Next"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
