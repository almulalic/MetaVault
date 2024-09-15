import { X } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@elements/ui/input";

export interface MultiInputProps {
	value?: string[];
	onChange: (value: string[]) => void;
	placeholder?: string;
	defaultValue?: string[];
	unique?: boolean;
}

export function MultiInput({ value = [], onChange, placeholder, unique }: MultiInputProps) {
	const [inputValue, setInputValue] = useState("");

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === "Tab" || e.key === "," || e.key === " ") {
			e.preventDefault();
			if (inputValue.trim() && unique && !value.includes(inputValue.trim())) {
				onChange([...value, inputValue.trim()]);
				setInputValue("");
			}
		}
	};

	const handleRemove = (itemsToRemove: string) => {
		const updatedValues = value.filter((value) => value !== itemsToRemove);
		onChange(updatedValues);
	};

	return (
		<div className="flex flex-wrap items-center border rounded-lg">
			{value.map((item) => (
				<div
					key={item}
					className="flex items-center bg-gray-700 text-white text-sm rounded-full px-3 py-1 mr-2 mb-2"
				>
					{item}
					<X className="ml-2 cursor-pointer" size={16} onClick={() => handleRemove(item)} />
				</div>
			))}

			<Input
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				className="border-none"
				defaultValue=""
			/>
		</div>
	);
}
