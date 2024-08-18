import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { AuthAPIService } from "../../api/services";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@elements/ui/form";
import { Button } from "@elements/ui/button";
import { Input } from "@elements/ui/input";
import { Checkbox } from "@elements/ui/checkbox";
import { ReloadIcon } from "@radix-ui/react-icons";
import { GoogleButton } from "@components/GoogleButton/GoogleButton";
import { AppDispatch, RootState } from "@store/store";
import { login_attempt, login_failed, login_sucessfull } from "@store/slice/authSlice";

import "./Login.scss";

export type LoginFormData = {
	email: string;
	password: string;
	rememberMe?: boolean;
};

const EmailOrUsernameSchema = z
	.string()
	.email({ message: "Invalid email address" })
	.or(
		z.string().regex(/^[a-zA-Z0-9_]{3,16}$/, {
			message:
				"Username must be between 3 and 16 characters long and contain only alphanumeric characters or underscores"
		})
	);

const LoginFormSchema = z.object({
	identifier: EmailOrUsernameSchema,
	password: z.string().min(6).max(32),
	rememberMe: z.boolean().optional().default(false)
});

export function Login() {
	const { isLoading } = useSelector((state: RootState) => state.auth);

	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {}
	});

	const onSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
		dispatch(login_attempt());

		let response: AxiosResponse = await AuthAPIService.login(
			data.identifier,
			data.password,
			data.rememberMe
		);

		if (response.status == 200) {
			dispatch(login_sucessfull(response.data));
			navigate("/");
		} else {
			dispatch(login_failed());
		}
	};

	const onGoogleAuthClick = (e: any) => {
		console.log(e);
	};

	return (
		<div id="login-page" className="h-lvh">
			<div className="container relative hidden flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
				<div className="lg:p-8 ">
					<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] ">
						<div className="flex flex-col space-y-2 text-center">
							<h1 className="text-2xl font-semibold tracking-tight">Log into your account</h1>
						</div>
						<Form {...loginForm}>
							<form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-8">
								<FormField
									control={loginForm.control}
									name="identifier"
									render={({ field }: any) => (
										<FormItem>
											<FormLabel>Email or Username</FormLabel>
											<FormControl>
												<Input placeholder="th@example.com" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={loginForm.control}
									name="password"
									render={({ field }: any) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input type="password" placeholder="•••••••••••••••••••••••" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={loginForm.control}
									name="rememberMe"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													disabled={isLoading || field.disabled}
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>Remember me</FormLabel>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? (
										<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
									) : (
										<span>Submit</span>
									)}
								</Button>
							</form>
						</Form>
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">Or</span>
							</div>
						</div>
						<div className="flex justify-center">
							<GoogleButton onClick={onGoogleAuthClick} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
