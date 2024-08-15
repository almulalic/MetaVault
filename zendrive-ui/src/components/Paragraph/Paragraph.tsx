import { cn } from "@utils/utils";
import { ReactNode } from "react";

export interface ParagraphProps {
	id?: string;
	classNames?: string;
	children: ReactNode;
}

export default function Paragraph({ id, classNames, children }: ParagraphProps) {
	return (
		<p id={id} className={cn("leading-7 [&:not(:first-child)]:mt-6", classNames)}>
			{children}
		</p>
	);
}
