import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { toast } from "@components/ui/use-toast";
import { FileTreeService } from "@services/FileTreeService";
import { AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export interface DeleteMetafileDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	metafile: MetaFile;
}

export function DeleteMetafileDialog({ open, onOpenChange, metafile }: DeleteMetafileDialogProps) {
	const [isLoading, setLoading] = useState(false);

	const handleCancel = () => {
		onOpenChange(false);
	};

	async function deleteMetafile() {
		const response: AxiosResponse = await FileTreeService.deleteFile(metafile.id);

		if (response.status === 200) {
			toast({
				title: `Sucessfully deleted metafile ${metafile.name} (${metafile.id}).`
			});
		} else {
			toast({
				title: "An error has occured",
				description: `${response.status}:${response.data.error}`
			});
		}
	}

	const handleConfirm = async () => {
		setLoading(true);
		try {
			await deleteMetafile();
			window.location.reload();
		} finally {
			setLoading(false);
		}

		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete file</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col">
					<div className="mb-4">
						<p>Are you sure you want to delete file {metafile.name} and all it's children?</p>
					</div>
					<div className="flex w-full gap-4">
						<Button onClick={handleCancel} variant="secondary" className="w-full" size="sm">
							Cancel
						</Button>
						<Button
							onClick={handleConfirm}
							className="w-full"
							size="sm"
							variant="destructive"
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Confirm
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
