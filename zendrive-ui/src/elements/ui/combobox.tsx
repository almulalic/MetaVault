"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { Button } from "@elements/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList
} from "@elements/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@elements/ui/popover";
import { cn } from "@utils/utils";
import { Input } from "./input";
import { useState } from "react";

export interface ComboboxItem {
	label: string;
	value: string;
}

export interface ComboboxProps {
	items: ComboboxItem[];
	placeholder: string;
	emptyMessage: string;
	onChange: (value: string) => void;
	onSearchChange: (e: any) => void;
	popoverButtonClassName?: string;
	popoverClassName: string;
}

export function Combobox({
	items,
	placeholder,
	emptyMessage,
	onChange,
	onSearchChange,
	popoverButtonClassName,
	popoverClassName
}: ComboboxProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedItem, setSelectedItem] = useState<ComboboxItem | null>(null);

	const onSearchChangeInternal = (val: string) => {
		setSearch(val);
	};

	const onChangeInternal = (val: string) => {
		const item = items.find((item: ComboboxItem) => item.value === val);

		if (item) {
			setSearch("");
			setSelectedItem(item);
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(popoverButtonClassName, "justify-between")}
				>
					{selectedItem ? selectedItem.label : placeholder}
					<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("p-0", popoverClassName)}>
				<Command>
					<Input
						value={search}
						placeholder={placeholder}
						className="h-9 w-full"
						onChange={(e) => {
							onSearchChangeInternal(e.target.value);
							onSearchChange(e.target.value);
						}}
					/>
					<CommandList>
						<CommandEmpty>{emptyMessage}</CommandEmpty>
						<CommandGroup>
							{items.map((item: ComboboxItem) => (
								<CommandItem
									className="cursor-pointer"
									key={item.value}
									value={item.value}
									onSelect={() => {
										onChangeInternal(item.value);
										onChange(item.value);
										setOpen(false);
									}}
								>
									{item.label}
									<CheckIcon
										className={cn(
											"ml-auto h-4 w-4",
											selectedItem?.value === item.value ? "opacity-100" : "opacity-0"
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
}
