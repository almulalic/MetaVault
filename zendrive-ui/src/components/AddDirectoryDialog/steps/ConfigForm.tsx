import { useDispatch, useSelector } from "react-redux";
import Heading, { HeadingType } from "@components/Heading/Heading";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@elements/ui/form";
import { z } from "zod";
import { MutableRefObject } from "react";
import { RootState } from "@store/store";
import { useForm } from "react-hook-form";
import { Checkbox } from "@elements/ui/checkbox";
import { Separator } from "@elements/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { change_config, next_step } from "@store/slice/addDirectorySlice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@elements/ui/select";

export interface ConfigFormProps {
	submitRef: MutableRefObject<any>;
}

const FormSchema = z.object({
	sync: z.boolean().default(false),
	syncPeriod: z.string().optional()
});

export function ConfigForm({ submitRef }: ConfigFormProps) {
	const dispatch = useDispatch();
	const { config } = useSelector((state: RootState) => state.addDirectory);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			sync: config.sync,
			syncPeriod: ""
		}
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		dispatch(change_config({ ...config, sync: data.sync }));
		dispatch(next_step());
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col">
				<Heading type={HeadingType.FIVE}>Additional Config</Heading>
				<p className="text-sm text-muted-foreground">
					Various config related to lifecycle of the directory.
				</p>
			</div>

			<Separator />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
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
					)}

					<input type="submit" hidden ref={submitRef} />
				</form>
			</Form>
		</div>
	);
}
