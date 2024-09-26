import { z } from "zod";
import { useState } from "react";
import { AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@elements/ui/input";
import { Button } from "@elements/ui/button";
import { toast } from "@elements/ui/use-toast";
import { TaskService } from "@services/task/TaskService";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { SyncConfig } from "@apiModels/metafile/SyncConfig";
import { RecurringTask } from "@apiModels/task/RecurringTask";
import { EditRecurringJobDto } from "@apiModels/task/EditRecurringJobDto";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@elements/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@elements/ui/form";
import { useNavigate } from "react-router-dom";
import { RecurringTaskService } from "@services/task/RecurringTaskService";
import { ConflictStrategy } from "@apiModels/task/ConflictStrategy";

export interface EditRecurringTaskDialogProps {
	recurringTask: RecurringTask;
	isOpen: boolean;
	onOpenChange: (newState: boolean) => void;
}

const FormSchema = z.object({
	cronExpression: z
		.string()
		.min(1, { message: "Cron expression is required" })
		.refine(
			(value) => {
				try {
					const cronParts = value.split(" ");
					return cronParts.length === 5;
				} catch {
					return false;
				}
			},
			{ message: "Invalid cron expression" }
		)
});

type FormSchemaData = z.infer<typeof FormSchema>;

export default function EditRecurringTaskDialog({
	recurringTask,
	isOpen,
	onOpenChange
}: EditRecurringTaskDialogProps) {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const form = useForm<FormSchemaData>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			cronExpression: recurringTask.data.scheduleExpression || ""
		}
	});

	const onSubmit = async (data: FormSchemaData) => {
		setLoading(true);
		const response: AxiosResponse<String> = await RecurringTaskService.edit(
			recurringTask.id,
			new EditRecurringJobDto(new SyncConfig(data.cronExpression, 5, ConflictStrategy.OVERRIDE))
		);

		if (response.status === 200) {
			toast({
				title: `Sucessfully edited recurring task '${recurringTask.id}'.`
			});

			onOpenChange(false);
			setLoading(false);
		} else {
			toast({
				title: "Something went wrong!",
				description: response.data.message
			});

			setLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Recurring job</DialogTitle>
				</DialogHeader>

				<div>
					<div className="flex justify-between">
						<span className="text-base text-gray-500">ID</span>
						<span className="text-base text-ellipsis whitespace-nowrap overflow-hidden max-w-92">
							{recurringTask.id}
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-base text-gray-500">Name</span>
						<span className="text-base text-ellipsis whitespace-nowrap overflow-hidden max-w-92">
							{recurringTask.data.name}
						</span>
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="cronExpression"
							disabled={loading}
							defaultValue=""
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cron Expression</FormLabel>
									<FormControl>
										<Input placeholder="5 * * * *" {...field} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="w-full flex gap-4 mt-4 select-none">
							<Button
								variant="secondary"
								className="w-1/2"
								onClick={() => onOpenChange(false)}
								disabled={loading}
							>
								Cancel
							</Button>

							<Button className="w-1/2" type="submit" disabled={loading}>
								{loading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
								Submit
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
