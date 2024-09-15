import { z } from "zod";
import { useRef } from "react";
import { User } from "@apiModels/User";
import { useForm } from "react-hook-form";
import { Button } from "@elements/ui/button";
import { Checkbox } from "@elements/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardFooter, CardHeader } from "@elements/ui/card";
import { RoleMultiSelect } from "@components/RoleMultiSelect/RoleMultiSelect";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@elements/ui/form";

export interface ManageUserCardProps {
	user: User;
	onSave: (user: User, dto: ManagerUserFormValues) => Promise<void>;
}

const ManagerUserSchema = z.object({
	roles: z.array(z.string()).min(1, {
		message: "Must have at least 1 role!"
	}),
	enabled: z.boolean(),
	locked: z.boolean()
});

export type ManagerUserFormValues = z.infer<typeof ManagerUserSchema>;

export const ManageUserCard = ({ user, onSave }: ManageUserCardProps) => {
	const submitRef = useRef<HTMLInputElement>(null);

	const form = useForm({
		resolver: zodResolver(ManagerUserSchema),
		defaultValues: {
			roles: user.roles.map((x) => x.id),
			enabled: user.enabled,
			locked: user.locked
		}
	});

	const {
		formState: { isLoading, isSubmitting },
		handleSubmit
	} = form;

	const onSubmit = async (data: ManagerUserFormValues) => {
		console.log(data);
		await onSave(user, data);
	};

	return (
		<Card className="mt-4">
			<CardHeader>
				<h2 className="text-lg font-semibold">Edit User</h2>
				<h3>
					{user.displayName} ({user.email})
				</h3>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="roles"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Roles</FormLabel>
									<FormControl>
										<RoleMultiSelect
											hideLabel
											onChange={field.onChange}
											defaultValue={field.value}
											loading={isLoading || isSubmitting || field.disabled}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="enabled"
							render={({ field }) => (
								<FormItem className="flex items-center space-x-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={(checked) => field.onChange(checked)}
											disabled={isLoading || isSubmitting || field.disabled}
										/>
									</FormControl>
									<FormLabel>Enabled</FormLabel>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="locked"
							render={({ field }) => (
								<FormItem className="flex items-center space-x-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={isLoading || isSubmitting || field.disabled}
										/>
									</FormControl>
									<FormLabel>Locked</FormLabel>
								</FormItem>
							)}
						/>

						<input type="submit" hidden ref={submitRef} />
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex gap-4 justify-end">
				<Button variant="destructive" onClick={() => {}}>
					Delete
				</Button>

				<Button onClick={() => submitRef.current?.click()} loading={isLoading || isSubmitting}>
					Save
				</Button>
			</CardFooter>
		</Card>
	);
};
