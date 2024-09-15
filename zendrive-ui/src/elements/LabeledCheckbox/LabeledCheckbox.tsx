import { MouseEvent } from "react";
import { Checkbox } from "@elements/ui/checkbox";

export interface LabeledCheckboxProps {
	id: string;
	checked: boolean;
	onClick: (e: MouseEvent<any>) => void;
	disabled?: boolean;
}

export default function LabeledCheckbox({
	id,
	checked,
	onClick,
	disabled = false
}: LabeledCheckboxProps) {
	return (
		<div className="flex items-center space-x-2">
			<Checkbox id={id} checked={checked} onClick={onClick} disabled={disabled} />
			<label
				htmlFor={id}
				className="select-none cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				Enabled
			</label>
		</div>
	);
}
