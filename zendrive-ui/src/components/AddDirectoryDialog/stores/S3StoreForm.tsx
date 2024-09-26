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
	set_storage_crednetials
} from "@store/slice/addDirectorySlice";

export interface S3FormProps {
	submitRef: MutableRefObject<any>;
}

export function S3StoreForm({ submitRef }: S3FormProps) {
	const dispatch = useDispatch<AppDispatch>();
	const { isLoading, metafileConfig: config } = useSelector(
		(state: RootState) => state.addDirectory
	);

	const FormSchema = z.object({
		s3Url: z
			.string()
			.trim()
			.regex(/^s3:\/\/[a-z0-9\-\.]+\/.+$/, {
				message: "S3 URL must be a valid URL (e.g., s3://bucket-name/path)."
			})
			.min(2, {
				message: "S3 URL must be at least 2 characters long."
			}),
		credentials: z.string().trim().min(1, {
			message: "Credentials are required and cannot be empty."
		})
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			s3Url: config.inputPath || "",
			credentials: config.storageConfig.credentials || ""
		}
	});

	async function onSubmit(data: z.infer<typeof FormSchema>): Promise<boolean> {
		dispatch(set_add_form_loading(true));

		try {
			const response: AxiosResponse<MetaFile | ErrorResponse> = await MetafileService.exists(
				new GenericMetafileDto(data.s3Url)
			);

			if (response.status === 200) {
				form.setError("s3Url", {
					type: "validate",
					message: "Path is already scanned, rescan to update!"
				});

				dispatch(set_add_form_loading(false));
				return false;
			}
		} catch (err) {
			dispatch(set_add_form_loading(false));
			dispatch(set_path(data.s3Url));
			dispatch(set_storage_crednetials(data.credentials));
			dispatch(next_step());
		}

		return false;
	}

	return (
		<div className="flex flex-col gap-4">
			<div>
				<Heading type={HeadingType.FIVE}>S3 Storage</Heading>
				<p className="text-sm text-muted-foreground">
					Add directories that are stored on a S3 bucket. Amazon public buckets are supported out of
					the box but for private and custom S3 protocol implementations, credentials must be added
					first.
				</p>
			</div>

			<Separator />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="s3Url"
						disabled={isLoading}
						defaultValue=""
						render={({ field }) => (
							<FormItem>
								<FormLabel>S3 URL</FormLabel>
								<FormControl>
									<Input placeholder="s3://amazonaws.com/bucket-name/path" {...field} />
								</FormControl>
								<FormDescription>
									Full S3 URL for the resource. Make sure that this path includes region, endpoint,
									bucket and prefix. Avoid sending credentials within this path.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="credentials"
						disabled={isLoading}
						defaultValue=""
						render={({ field }) => (
							<FormItem>
								<FormLabel>S3 Credentials</FormLabel>
								<FormControl>
									<Input placeholder="admin_credentials" {...field} />
								</FormControl>
								<FormDescription>
									S3 Credentials key that will be used for authentication.
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
