import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@elements/ui/form";
import { Input } from "@elements/ui/input";

import { useToast } from "@elements/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocalScanService } from "@services/LocalScanService";
import { AxiosResponse } from "axios";
import { MutableRefObject } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Heading from "@components/Heading/Heading";
import { HeadingType } from "../../Heading/Heading";
import { useDispatch, useSelector } from "react-redux";
import {
	next_step,
	set_add_form_loading,
	set_path,
	set_scan_check_response
} from "@store/slice/addDirectorySlice";
import { MetafilePermissions } from "@apiModels/metafile/MetafilePermissions";
import { Separator } from "@elements/ui/separator";
import { MetafileConfig } from "@apiModels/metafile";
import { AppDispatch, RootState } from "@store/store";

export interface LocalStoreFormProps {
	submitRef: MutableRefObject<any>;
}

export function LocalStoreForm({ submitRef }: LocalStoreFormProps) {
	const { toast } = useToast();

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

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		dispatch(set_add_form_loading(true));

		const checkResponse: AxiosResponse<ScanCheckResponse> = await LocalScanService.check({
			destinationId: "",
			permissions: new MetafilePermissions([], [], []),
			config: new MetafileConfig(false, data.absolutePath, null)
		});

		if (checkResponse.status !== 200) {
			toast({
				title: "An unexpected error has occured!"
			});

			dispatch(set_add_form_loading(false));
			return;
		}

		if (checkResponse.data.errorMessage) {
			toast({
				title: checkResponse.data.errorMessage
			});

			dispatch(set_add_form_loading(false));

			return;
		}

		dispatch(set_add_form_loading(false));
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

					<input type="submit" hidden ref={submitRef} />
				</form>
			</Form>
		</div>
	);
}
