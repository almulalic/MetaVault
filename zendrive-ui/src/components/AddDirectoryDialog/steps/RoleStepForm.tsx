import { RootState } from "@store/store";
import { useDispatch, useSelector } from "react-redux";
import Heading, { HeadingType } from "@components/Heading/Heading";
import {
	Form,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@elements/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { MultiSelect } from "@elements/ui/multi-select";
import { MutableRefObject, useEffect, useState } from "react";
import {
	next_step,
	set_add_form_loading,
	change_permissions
} from "@store/slice/addDirectorySlice";
import { AxiosResponse } from "axios";
import { RoleService } from "@services/RoleService";
import { Role } from "@apiModels/auth/Role";
import { Separator } from "@elements/ui/separator";

export interface RoleStepFormProps {
	submitRef: MutableRefObject<any>;
}

export function RoleStepForm({ submitRef }: RoleStepFormProps) {
	const dispatch = useDispatch();
	const { permissions } = useSelector((state: RootState) => state.addDirectory);

	const FormSchema = z.object({
		read: z.array(z.string()).min(1, {
			message: "Must have at least 1 read role!"
		}),
		write: z.array(z.string()).min(1, {
			message: "Must have at least 1 write role!"
		}),
		execute: z.array(z.string()).optional()
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			read: permissions.read,
			write: permissions.write,
			execute: permissions.execute
		}
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		dispatch(change_permissions(data));
		dispatch(next_step());
	}

	const [availableRoles, setAvailableRoles] = useState<{ label: string; value: string }[]>([]);

	useEffect(() => {
		async function getRoles() {
			dispatch(set_add_form_loading(true));

			const response: AxiosResponse<Role[]> = await RoleService.getAll();

			if (response.status === 200) {
				setAvailableRoles(response.data.map((x: Role) => ({ label: x.name, value: x.id })));
				dispatch(set_add_form_loading(false));
			}
		}

		getRoles();
	}, []);

	function onReadRoleAdd(values: string[]) {
		dispatch(change_permissions({ read: [...permissions.read, ...values] }));
	}

	function onWriteRoleAdd(values: string[]) {
		dispatch(change_permissions({ write: [...permissions.write, ...values] }));
	}

	function onExecuteRoleAdd(values: string[]) {
		dispatch(change_permissions({ execute: [...permissions.execute, ...values] }));
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col">
				<Heading type={HeadingType.FIVE}>Roles</Heading>
				<p className="text-sm text-muted-foreground">
					Select one or more roles that will have read/write/execute permissions for the folder and
					it's files.
				</p>
			</div>

			<Separator />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="read"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Read</FormLabel>
								<MultiSelect
									options={availableRoles}
									value={field.value}
									onValueChange={(value) => {
										onReadRoleAdd(value);
										field.onChange(value);
									}}
									defaultValue={field.value}
									placeholder="Select roles..."
									animation={2}
								/>
								<FormDescription>
									Write roles are used to allow users to read file/folder and it's settings and
									metadata.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="write"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Write</FormLabel>
								<MultiSelect
									options={availableRoles}
									value={field.value}
									onValueChange={(value) => {
										onWriteRoleAdd(value);
										field.onChange(value);
									}}
									defaultValue={field.value}
									placeholder="Select roles..."
									animation={2}
								/>
								<FormDescription>
									Write roles are used to allow users to modify file/folder and it's settings and
									metadata.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="execute"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Execute</FormLabel>
								<MultiSelect
									options={availableRoles}
									value={field.value}
									onValueChange={(value) => {
										onExecuteRoleAdd(value);
										field.onChange(value);
									}}
									defaultValue={field.value || []}
									placeholder="Select roles..."
									animation={2}
								/>
								<FormDescription>
									Execute roles are used to allow users to set up and run automated scripts for the
									file/folder.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<input type="submit" hidden ref={submitRef} />
				</form>
			</Form>
		</div>
	);
}
