import { z } from "zod";
import { AxiosResponse } from "axios";
import { User } from "@apiModels/User";
import { useForm } from "react-hook-form";
import { Input } from "@elements/ui/input";
import { Button } from "@elements/ui/button";
import { RootState } from "../../store/store";
import { toast } from "@elements/ui/use-toast";
import { edit_sucessfull } from "@store/slice";
import { UserService } from "@services/UserService";
import { AuthService } from "@services/AuthService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { SettingsPage } from "@pages/Settings/Settings";
import { ErrorResponse } from "@apiModels/ErrorResponse";
import { UpdateUserDto } from "@apiModels/user/UpdateUserDto";
import { RefreshTokenResponse } from "@apiModels/auth/dto/RefreshTokenResponse";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@elements/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@elements/ui/card";

const EditUserSchema = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters"),
	lastName: z.string().min(2, "Last name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	displayName: z.string()
});

type EditUserFormValues = z.infer<typeof EditUserSchema>;

export function EditUserForm() {
	const dispatch = useDispatch();
	const { user, accessToken, refreshToken } = useSelector((state: RootState) => state.auth);

	if (!user) {
		return;
	}

	const form = useForm<EditUserFormValues>({
		resolver: zodResolver(EditUserSchema),
		defaultValues: {
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			displayName: user.displayName
		}
	});

	const {
		formState: { isLoading, isSubmitting },
		register,
		handleSubmit,
		formState: { errors }
	} = form;

	const onSubmit = async (data: EditUserFormValues) => {
		const updateResponse: AxiosResponse<User | ErrorResponse> = await UserService.update(
			new UpdateUserDto(data.firstName, data.lastName, data.displayName, data.email)
		);

		if (updateResponse.status !== 200) {
			form.setError("root.serverError", {
				type: "validate",
				message: (updateResponse.data as ErrorResponse).message
			});
			return;
		}

		const refreshResponse: AxiosResponse<RefreshTokenResponse | ErrorResponse> =
			await AuthService.refreshToken(accessToken!, refreshToken!);

		if (refreshResponse.status !== 200) {
			form.setError("root.serverError", {
				type: "validate",
				message: (refreshResponse.data as ErrorResponse).message
			});
			return;
		}

		dispatch(edit_sucessfull(refreshResponse.data as RefreshTokenResponse));

		toast({
			title: "Sucessfully updated."
		});
	};

	return (
		<SettingsPage>
			<Card className="flex flex-col justify-start gap-8 w-[40%]">
				<CardHeader>
					<CardTitle>Edit User</CardTitle>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input
										placeholder="First Name"
										{...register("firstName")}
										disabled={isLoading || isSubmitting}
									/>
								</FormControl>
								{errors.firstName && <FormMessage>{errors.firstName.message}</FormMessage>}
							</FormItem>

							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input
										placeholder="Last Name"
										{...register("lastName")}
										disabled={isLoading || isSubmitting}
									/>
								</FormControl>
								{errors.lastName && <FormMessage>{errors.lastName.message}</FormMessage>}
							</FormItem>

							<FormItem>
								<FormLabel>Display Name</FormLabel>
								<FormControl>
									<Input
										placeholder="Display Name"
										{...register("displayName")}
										disabled={isLoading || isSubmitting}
									/>
								</FormControl>
								{errors.displayName && <FormMessage>{errors.displayName.message}</FormMessage>}
							</FormItem>

							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="Email"
										{...register("email")}
										disabled={isLoading || isSubmitting}
									/>
								</FormControl>
								{errors.email && <FormMessage>{errors.email.message}</FormMessage>}
							</FormItem>

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
