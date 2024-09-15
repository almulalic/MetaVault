import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@utils/utils";

const textSizeMap: Record<string, string> = {
	sm: "text-xs",
	md: "text-base",
	lg: "text-lg"
};

const heightSizeMap: Record<string, string> = {
	sm: "h-4",
	md: "h-6",
	lg: "h-8"
};

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { size?: "sm" | "md" | "lg" } & {
		color?: string;
	}
>(({ className, value, size, color, ...props }, ref) => {
	const percentage = Math.round(value || 0);

	if (!size) {
		size = "sm";
	}

	return (
		<ProgressPrimitive.Root
			ref={ref}
			className={cn(
				`relative ${heightSizeMap[size]} w-full overflow-hidden rounded-full bg-secondary`,
				className
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className={`h-full w-full flex-1 ${color ? color : "bg-primary"} transition-all`}
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
			<div
				className={`absolute inset-0 flex items-center justify-center ${
					textSizeMap[size]
				} font-medium ${percentage <= 45 ? "text-white" : "text-black"} "`}
				aria-hidden="true"
			>
				{`${percentage}%`}
			</div>
		</ProgressPrimitive.Root>
	);
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
