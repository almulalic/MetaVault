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
import { AxiosResponse } from "axios";
import { MutableRefObject } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@elements/ui/input";
import { MetaFile } from "@apiModels/metafile";
import Heading from "@components/Heading/Heading";
import { Separator } from "@elements/ui/separator";
import { HeadingType } from "../../Heading/Heading";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch, RootState } from "@store/store";
import { useDispatch, useSelector } from "react-redux";
import { ErrorResponse } from "@apiModels/ErrorResponse";
import { MetafileService } from "@services/MetafileService";
import { GenericMetafileDto } from "@apiModels/metafile/GenericMetafileDto";
import {
	next_step,
	set_add_form_loading,
	set_path,
	set_file_stats
} from "@store/slice/addDirectorySlice";
import { FileStats } from "@apiModels/stats/FileStats";
import { StatsService } from "@services/StatsService";
import { StatsRequest } from "@apiModels/stats/StatsRequest";

export interface LocalStoreFormProps {
	submitRef: MutableRefObject<any>;
}

export function LocalStoreForm({ submitRef }: LocalStoreFormProps) {
	const dispatch = useDispatch<AppDispatch>();
	const { isLoading, config } = useSelector((state: RootState) => state.addDirectory);

	const FormSchema = z.object({
		absolutePath: z.string().min(2, {
			message: "Absolute path must be at least 2 characters."
		})
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			absolutePath: config.inputPath || ""
		}
	});

	async function onSubmit(data: z.infer<typeof FormSchema>): Promise<boolean> {
		dispatch(set_add_form_loading(true));

		const response: AxiosResponse<MetaFile | ErrorResponse> = await MetafileService.exists(
			new GenericMetafileDto(data.absolutePath)
		);

		if (response.status === 200) {
			form.setError("absolutePath", {
				type: "validate",
				message: "Path is already scanned, rescan to update!"
			});
			dispatch(set_add_form_loading(false));

			return false;
		}

		//todo decouple
		const statsResponse: AxiosResponse<FileStats> = await StatsService.get(
			new StatsRequest(data.absolutePath, config.storageConfig)
		);

		if (statsResponse.status === 200) {
			dispatch(set_file_stats(statsResponse.data));
			dispatch(set_add_form_loading(false));
			dispatch(set_path(data.absolutePath));
			dispatch(next_step());

			return true;
		} else {
			dispatch(set_add_form_loading(false));

			form.setError("root", {
				type: "validate",
				message: statsResponse.data || statsResponse.data.message
			});
		}

		return false;
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
						defaultValue=""
						render={({ field }) => (
							<FormItem>
								<FormLabel>Absolute Path</FormLabel>
								<FormControl>
									<Input placeholder="/mnt/drive/path/to/directory" {...field} />
								</FormControl>
								<FormDescription>
									Absolute path to the directory. Make sure that this path never changes.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{form.formState.errors.root && (
						<FormMessage>Error: {form.formState.errors.root.message}</FormMessage>
					)}

					<input type="submit" hidden ref={submitRef} />
				</form>
			</Form>
		</div>
	);
}
