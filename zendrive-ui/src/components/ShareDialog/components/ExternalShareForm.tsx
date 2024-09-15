import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, ControllerRenderProps, useFieldArray, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@elements/ui/form";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from "@elements/ui/command";
import { Button } from "@elements/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@elements/ui/popover";
import { cn } from "@utils/utils";
import { CaretSortIcon, CheckIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { MultiInput } from "@elements/MultiInput/MultiInput";
import { MutableRefObject, useRef } from "react";

export interface ExternalShareFormProps {
	submitRef: MutableRefObject<any>;
}

export default function ExternalShareForm({ submitRef }: ExternalShareFormProps) {
	const rolesEnum = z.enum(["read", "write"]);
	const scrollableRef = useRef<HTMLFormElement>(null);

	const externalRoles = [
		{ value: rolesEnum.Enum.read, label: "Read" },
		{ value: rolesEnum.Enum.write, label: "Write" }
	];

	const FormSchema = z.object({
		fields: z.array(
			z.object({
				emails: z
					.array(z.string().email("Please enter a set of valid email address!"))
					.min(1, "Must have at least one email!"),
				role: z.enum(["read", "write"])
			})
		)
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			fields: [{ emails: [], role: rolesEnum.Enum.read }]
		},
		mode: "onChange"
	});

	const { fields, append, remove } = useFieldArray({
		name: "fields",
		control: form.control
	});

	const renderEmailInput = (field: ControllerRenderProps<any>, index: number) => {
		return (
			<MultiInput
				key={index}
				placeholder="Enter email adresses"
				value={field.value}
				onChange={(values) => {
					field.onChange(values);
				}}
				defaultValue={[]}
				unique
			/>
		);
	};

	const renderRoleSelect = (field: ControllerRenderProps<any>, index: number) => {
		return (
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
					>
						{field.value ? externalRoles.find((role) => role.value === field.value)?.label : "Role"}
						<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput placeholder="Search roles..." className="h-9" />
						<CommandList>
							<CommandEmpty>No roles found.</CommandEmpty>
							<CommandGroup>
								{externalRoles.map((role) => (
									<CommandItem
										value={role.label}
										key={role.value}
										className="cursor-pointer"
										onSelect={() => {
											form.setValue(`fields.${index}.role`, role.value);
										}}
									>
										{role.label}
										<CheckIcon
											className={cn(
												"ml-auto h-4 w-4",
												role.value === field.value ? "opacity-100" : "opacity-0"
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		);
	};

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(data);
	}

	return (
		<Form {...form}>
			<form
				ref={scrollableRef}
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 w-full overflow-y-scroll h-[300px] max-h-[300px]"
			>
				{fields.map((_, index) => (
					<FormField
						control={form.control}
						name={`fields.${index}`}
						render={() => (
							<FormItem>
								<FormLabel>Info</FormLabel>
								<FormControl>
									<div className="flex gap-4">
										<div className="w-[75%]">
											<Controller
												{...form.register(`fields.${index}.emails`)}
												render={({ field }) => renderEmailInput(field, index)}
											/>
										</div>
										<div className="w-[25%]">
											<Controller
												{...form.register(`fields.${index}.role`)}
												render={({ field }) => renderRoleSelect(field, index)}
											/>
										</div>
									</div>
								</FormControl>
								{form.formState.errors.fields?.[index] &&
								form.formState.errors.fields?.[index].emails &&
								form.formState.errors.fields?.[index].emails[0]! ? (
									<FormMessage>
										{form.formState.errors.fields?.[index].emails[0]?.message}
									</FormMessage>
								) : (
									<FormMessage>
										{form.formState.errors.fields?.[index]!.emails?.message}
									</FormMessage>
								)}
							</FormItem>
						)}
					/>
				))}

				<div className="flex w-full justify-end">
					{fields.length > 1 && (
						<Button
							type="button"
							variant="ghost"
							onClick={() => remove(fields.length - 1)}
							className="text-red-500 hover:text-red-700 flex items-center"
						>
							<MinusIcon className="w-5 h-5" />
							<span className="ml-2">Remove</span>
						</Button>
					)}

					<Button
						type="button"
						variant="ghost"
						onClick={() => {
							append({ emails: [], role: rolesEnum.Enum.read });

							setTimeout(() => {
								if (scrollableRef && scrollableRef.current) {
									scrollableRef.current.scroll({
										top: scrollableRef.current.scrollHeight,
										behavior: "smooth"
									});
								}
							}, 1);
						}}
						className="text-blue-500 hover:text-blue-700 flex items-center"
					>
						<PlusIcon className="w-5 h-5" />
						<span className="ml-2">Add</span>
					</Button>
				</div>

				<input type="submit" hidden ref={submitRef} />
				<FormMessage />
			</form>
		</Form>
	);
}
