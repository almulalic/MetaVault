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
import { next_step, set_add_form_loading, set_path } from "@store/slice/addDirectorySlice";

export interface LocalStoreFormProps {
	submitRef: MutableRefObject<any>;
}

const LocalForm = z.object({
	absolutePath: z.string().min(2, {
		message: "Absolute path must be at least 2 characters."
	})
});

type LocalFormData = z.infer<typeof LocalForm>;

export function LocalStoreForm({ submitRef }: LocalStoreFormProps) {
	const dispatch = useDispatch<AppDispatch>();
	const { isLoading, metafileConfig: config } = useSelector(
		(state: RootState) => state.addDirectory
	);

	const form = useForm<LocalFormData>({
		resolver: zodResolver(LocalForm),
		defaultValues: {
			absolutePath: config.inputPath || ""
		}
	});

	function appendProtocol(path: string): string {
		if (!path.startsWith("file://")) {
			return `file://${path}`;
		}

		return path;
	}

	async function onSubmit(data: LocalFormData): Promise<boolean> {
		dispatch(set_add_form_loading(true));

		try {
			const response: AxiosResponse<MetaFile, ErrorResponse> = await MetafileService.exists(
				new GenericMetafileDto(appendProtocol(data.absolutePath))
			);

			if (response.status === 200) {
				form.setError("absolutePath", {
					type: "validate",
					message: "Path is already scanned, rescan to update!"
				});

				dispatch(set_add_form_loading(false));

				return false;
			}
		} catch (err) {
			dispatch(set_add_form_loading(false));
			dispatch(set_path(data.absolutePath));
			dispatch(next_step());
		}

		return true;
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
									<Input placeholder="file:///mnt/drive/path/to/directory" {...field} />
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
