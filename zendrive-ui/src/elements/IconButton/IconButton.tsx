import { Button } from "@elements/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { cn } from "@utils/utils";
import { ReactNode, useState } from "react";

export interface IconButtonProps {
	className?: string;
	id?: string;
	variant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
		| null
		| undefined;
	children: ReactNode;
	tooltipContent?: ReactNode;
	onClick(): void;
}

export default function IconButton({
	id,
	className,
	children,
	variant,
	tooltipContent,
	onClick
}: IconButtonProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						id={id}
						className={cn("px-3 w-fit", className)}
						size="icon"
						variant={variant}
						onClick={onClick}
					>
						{children}
					</Button>
				</TooltipTrigger>

				<TooltipContent side="bottom" sideOffset={5}>
					<span className="text-xs">{tooltipContent}</span>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
