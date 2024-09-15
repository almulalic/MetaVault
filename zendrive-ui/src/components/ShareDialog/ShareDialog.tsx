import { Button } from "@elements/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@elements/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@elements/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import ExternalShareForm from "./components/ExternalShareForm";
import { useRef, useState } from "react";

export interface ShareDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export enum ShareTypeInput {
	EXTERNAL,
	INTERNAL
}

export default function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
	const submitRef = useRef<HTMLInputElement>(null);

	const [currentSubmitRef, setCurrentSubmitRef] = useState(submitRef);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Share File</DialogTitle>
				</DialogHeader>

				<div className="min-h-[300px]">
					<Tabs
						className="py-4"
						defaultValue={ShareTypeInput.EXTERNAL.toString()}
						onValueChange={() => {}}
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value={ShareTypeInput.EXTERNAL.toString()}>External</TabsTrigger>
							<TabsTrigger value={ShareTypeInput.INTERNAL.toString()}>Internal</TabsTrigger>
						</TabsList>

						<TabsContent className="p-4" value={ShareTypeInput.EXTERNAL.toString()}>
							<ExternalShareForm submitRef={submitRef} />
						</TabsContent>

						<TabsContent value={ShareTypeInput.INTERNAL.toString()}></TabsContent>
					</Tabs>
				</div>

				<DialogFooter className="space-x-2 w-full flex gap-4">
					<Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						className="w-full"
						onClick={() => {
							currentSubmitRef && currentSubmitRef.current && currentSubmitRef.current.click();
						}}
					>
						Share
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
