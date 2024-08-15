import { Checkbox } from "@components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@components/ui/select";
import { useToast } from "@components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocalScanService } from "@services/LocalScanService";
import { AxiosResponse } from "axios";
import { MutableRefObject } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Heading from "@components/Heading/Heading";
import { HeadingType } from "../../Heading/Heading";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
	next_step,
	set_loading,
	set_path,
	set_scan_check_response
} from "../../../store/addDirectorySlice";
import { MetafilePermissions } from "@apiModels/Permissions";
import { Separator } from "@components/ui/separator";

export interface LocalStoreFormProps {
	submitRef: MutableRefObject<any>;
}

export function LocalStoreForm({ submitRef }: LocalStoreFormProps) {
	const { toast } = useToast();

	const dispatch = useDispatch<AppDispatch>();
	const { isLoading, path } = useSelector((state: RootState) => state.addDirectory);

	const FormSchema = z.object({
		absolutePath: z.string().min(2, {
			message: "Absolute path must be at least 2 characters."
		}),
		sync: z.boolean().default(false).optional(),
		syncPeriod: z
			.string()
			.optional()
			.superRefine((data, ctx) => {
				// if (data && data.sync && !data.syncPeriod) {
				// 	ctx.addIssue({
				// 		code: z.ZodIssueCode.custom,
				// 		path: ["syncPeriod"],
				// 		message: "Sync period is required when sync is enabled."
				// 	});
				// }
			})
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			absolutePath: path || "",
			sync: false,
			syncPeriod: ""
		}
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		dispatch(set_loading(true));

		const checkResponse: AxiosResponse<ScanCheckResponse> = await LocalScanService.check({
			path: data.absolutePath,
			destinationId: "",
			permissions: new MetafilePermissions([], [], [])
		});

		if (checkResponse.status !== 200) {
			toast({
				title: "An unexpected error has occured!"
			});

			dispatch(set_loading(false));
			return;
		}

		if (checkResponse.data.errorMessage) {
			toast({
				title: checkResponse.data.errorMessage
			});

			dispatch(set_loading(false));
			return;
		}

		dispatch(set_loading(false));
		dispatch(set_path(data.absolutePath));
		dispatch(set_scan_check_response(checkResponse.data));
		dispatch(next_step());
	}

	return (
		<div className="flex flex-col gap-4">
			<div>
				<Heading type={HeadingType.FIVE}>Local Storage</Heading>
				<p className="text-sm text-muted-foreground">
					Add directories that are local to this deployment. Make sure that the system user is able
					to access them now in the future and/or that the docker/k8s volumes are mounted properly.
				</p>
			</div>

			<Separator />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="absolutePath"
						disabled={isLoading}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Absolute Path</FormLabel>
								<FormControl>
									<Input
										placeholder="/mnt/drive/path/to/directory"
										{...field}
										defaultValue={"almir"}
									/>
								</FormControl>
								<FormDescription>
									Absolute path to the directory. Make sure that this path never changes.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* 
					<FormField
						control={form.control}
						disabled={isLoading}
						name="sync"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0">
								<FormControl>
									<Checkbox
										disabled={field.disabled}
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel>Automatic Sync</FormLabel>
									<FormDescription>
										Automatically sync the underlying changes on a specified schedule.
									</FormDescription>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					{form.getValues("sync") && (
						<div className="ml-4">
							<FormField
								control={form.control}
								name="syncPeriod"
								disabled={isLoading}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Sync Period</FormLabel>
										<Select
											disabled={field.disabled}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a time period" />
												</SelectTrigger>
											</FormControl>

											<SelectContent>
												<SelectItem value="hour">Hourly</SelectItem>
												<SelectItem value="day">Daily</SelectItem>
												<SelectItem value="month">Monthly</SelectItem>
												<SelectItem value="year">Yearly</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>Choose the time period for syncing changes.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)} */}

					<input type="submit" hidden ref={submitRef} />
				</form>
			</Form>
		</div>
	);
}
