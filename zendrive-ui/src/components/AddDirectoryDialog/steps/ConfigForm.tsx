import {
	Form,
	FormItem,
	FormField,
	FormLabel,
	FormMessage,
	FormControl,
	FormDescription
} from "@elements/ui/form";
import { z } from "zod";
import { MutableRefObject } from "react";
import { RootState } from "@store/store";
import { useForm } from "react-hook-form";
import { Input } from "@elements/ui/input";
import { camelCaseToWords, isValidCron } from "@utils/utils";
import { Checkbox } from "@elements/ui/checkbox";
import { Separator } from "@elements/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import Heading, { HeadingType } from "@components/Heading/Heading";
import { change_config, next_step } from "@store/slice/addDirectorySlice";
import { ConflictStrategy } from "@apiModels/task/ConflictStrategy";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@elements/ui/select";

export interface ConfigFormProps {
	submitRef: MutableRefObject<any>;
}

const ConfigFormSchema = z
	.object({
		sync: z.boolean().default(false),
		cronExpression: z.string().optional(),
		maxConcurrency: z.coerce.number().min(1, "Minimum concurrency is 1."),
		fileConflictStrategy: z
			.enum([ConflictStrategy.OVERRIDE, ConflictStrategy.IGNORE, ConflictStrategy.PANIC])
			.optional()
	})
	.refine(
		(data) => {
			return !(data.sync && !data.cronExpression);
		},
		{
			message: "Cron Expression is required when sync is set to true.",
			path: ["cronExpression"]
		}
	)
	.refine(
		(data) => {
			return !data.sync || (data.cronExpression && isValidCron(data.cronExpression));
		},
		{
			message: "Must be a valid cron expression.",
			path: ["cronExpression"]
		}
	)
	.refine(
		(data) => {
			return !data.sync || data.fileConflictStrategy;
		},
		{
			message: "File conflict strategy is required when sync is set to true.",
			path: ["fileConflictStrategy"]
		}
	);

type ConfigFormData = z.infer<typeof ConfigFormSchema>;

export function ConfigForm({ submitRef }: ConfigFormProps) {
	const dispatch = useDispatch();
	const { metafileConfig: config } = useSelector((state: RootState) => state.addDirectory);

	const form = useForm<ConfigFormData>({
		resolver: zodResolver(ConfigFormSchema),
		defaultValues: {
			sync: config.syncConfig !== null,
			cronExpression: config.syncConfig ? config.syncConfig.cronExpression : "",
			maxConcurrency: config.syncConfig ? config.syncConfig.maxConcurrency : 1,
			fileConflictStrategy: config.syncConfig
				? config.syncConfig.fileConflictStrategy
				: ConflictStrategy.OVERRIDE
		}
	});

	function onSubmit(data: ConfigFormData): void {
		if (data.sync) {
			if (data.cronExpression && data.fileConflictStrategy) {
				dispatch(
					change_config({
						...config,
						syncConfig: {
							cronExpression: data.cronExpression,
							maxConcurrency: data.maxConcurrency,
							fileConflictStrategy: data.fileConflictStrategy
						}
					})
				);
			}
		} else {
			dispatch(change_config({ ...config, syncConfig: null }));
		}

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
						<div className="ml-8 space-y-4">
							<FormField
								control={form.control}
								name="cronExpression"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cron Expression</FormLabel>
										<FormControl>
											<Input placeholder="5 * * * *" {...field} />
										</FormControl>

										<FormDescription>CRON expression which specifies the schedule.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="fileConflictStrategy"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Conflict Strategy</FormLabel>
										<FormControl>
											<Select onValueChange={field.onChange} defaultValue={field.value}>
												<SelectTrigger>
													<SelectValue placeholder="Select Conflict Strategy" />
												</SelectTrigger>
												<SelectContent>
													{Object.values(ConflictStrategy).map((strategy) => (
														<SelectItem key={strategy} value={strategy}>
															{camelCaseToWords(strategy)}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>

										<FormDescription>
											Defines how are conflicting files going to be handled
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="maxConcurrency"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Maximum number of concurrent tasks</FormLabel>
										<FormControl>
											<Input type="number" placeholder="1" {...field} />
										</FormControl>

										<FormDescription>
											Maximum number of concurrent jobs that can be active at the same time.
										</FormDescription>
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
