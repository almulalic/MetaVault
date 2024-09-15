import { z } from "zod";
import { AxiosResponse } from "axios";
import { User } from "@apiModels/user";
import { useForm } from "react-hook-form";
import { Input } from "@elements/ui/input";
import { Button } from "@elements/ui/button";
import { toast } from "@elements/ui/use-toast";
import { UserService } from "@services/UserService";
import { AuthType } from "@apiModels/auth/AuthType";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsPage } from "@pages/Settings/Settings";
import { ErrorResponse } from "@apiModels/ErrorResponse";
import { CreaterUserDto } from "@apiModels/user/CreateUserDto";
import LabeledCheckbox from "@elements/LabeledCheckbox/LabeledCheckbox";
import { Card, CardContent, CardHeader, CardTitle } from "@elements/ui/card";
import { RoleMultiSelect } from "@components/RoleMultiSelect/RoleMultiSelect";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@elements/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@elements/ui/select";

const AddUserFormSchema = z.object({
	authType: z.enum([AuthType.PLAIN, AuthType.GOOGLE]),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	displayName: z.string().min(1, "Display name is required"),
	enabled: z.boolean(),
	roles: z.array(z.string()).min(1, {
		message: "Must have at least 1 role!"
	})
});

type AddUserFormData = z.infer<typeof AddUserFormSchema>;

export default function AddUserForm() {
	const form = useForm<AddUserFormData>({
		resolver: zodResolver(AddUserFormSchema),
		defaultValues: {
			authType: AuthType.PLAIN,
			enabled: false,
			roles: []
		}
	});

	const {
		formState: { isLoading, isSubmitting, errors },
		handleSubmit
	} = form;

	const onSubmit = async (data: AddUserFormData) => {
		const response: AxiosResponse<User | ErrorResponse> = await UserService.create(
			new CreaterUserDto(
				data.authType,
				data.firstName,
				data.lastName,
				data.email,
				data.displayName,
				data.roles
			)
		);

		if (response.status !== 200) {
			form.setError("root.serverError", {
				type: "validate",
				message: (response.data as ErrorResponse).message
			});
			return;
		}

		toast({
			title: "User sucessfully created!"
		});
	};

	return (
		<SettingsPage>
			<Card className="flex flex-col justify-start gap-8 w-[40%]">
				<CardHeader>
					<CardTitle>Add User</CardTitle>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
							<FormField
								control={form.control}
								name="authType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Authentication Type</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={isLoading || isSubmitting}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select an option" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value={AuthType.PLAIN}>Plain</SelectItem>
												<SelectItem value={AuthType.GOOGLE}>Google Auth</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input {...field} disabled={isLoading || isSubmitting} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input {...field} disabled={isLoading || isSubmitting} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} disabled={isLoading || isSubmitting} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="displayName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Display Name</FormLabel>
										<FormControl>
											<Input {...field} disabled={isLoading || isSubmitting} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="roles"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Roles</FormLabel>
										<FormControl>
											<RoleMultiSelect
												onChange={(value) => field.onChange(value)}
												defaultValue={field.value}
												hideLabel
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="enabled"
								render={({ field }) => (
									<FormItem className="flex items-center space-x-2">
										<FormControl>
											<LabeledCheckbox
												id="enabled"
												checked={field.value}
												onClick={field.onChange}
												disabled={isLoading || isSubmitting}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							{errors.root && errors.root.serverError.type && (
								<FormMessage>{errors.root.serverError.message}</FormMessage>
							)}

							<Button type="submit" loading={isLoading || isSubmitting}>
								Submit
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</SettingsPage>
	);
}
