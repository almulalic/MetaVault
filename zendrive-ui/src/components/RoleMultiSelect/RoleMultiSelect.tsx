import { AxiosResponse } from "axios";
import { Role } from "@apiModels/auth/Role";
import { useEffect, useState } from "react";
import { RoleService } from "@services/RoleService";
import { MultiSelect } from "@elements/ui/multi-select";
import { cn } from "@utils/utils";

export interface RoleMultiSelectProps {
	className?: string;
	defaultValue: string[];
	onChange: (val: string[]) => void;
	inline?: boolean;
	hideLabel?: boolean;
	loading?: boolean;
	disabled?: boolean;
}

export function RoleMultiSelect({
	className,
	defaultValue,
	onChange,
	inline = false,
	hideLabel = false,
	loading = false,
	disabled = false
}: RoleMultiSelectProps) {
	const [rolesLoading, setRolesLoading] = useState(true);
	const [availableRoles, setAvailableRoles] = useState<{ label: string; value: string }[]>([]);

	useEffect(() => {
		async function getRoles() {
			setRolesLoading(true);

			const response: AxiosResponse<Role[]> = await RoleService.getAll();

			if (response.status === 200) {
				setAvailableRoles(response.data.map((x: Role) => ({ label: x.name, value: x.id })));
				setRolesLoading(false);
			}
		}

		getRoles();
	}, []);

	return (
		<div className={cn("flex justify-start gap-4", !inline && "flex-col", className)}>
			{!hideLabel && <h3 className="text-base font-medium">Roles</h3>}
			<MultiSelect
				options={availableRoles}
				onValueChange={(value) => {
					onChange(value);
				}}
				defaultValue={defaultValue}
				placeholder="Select roles..."
				animation={2}
				disabled={rolesLoading || loading}
			/>
		</div>
	);
}
