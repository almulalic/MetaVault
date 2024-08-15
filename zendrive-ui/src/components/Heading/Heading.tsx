import { cn } from "@utils/utils";
import { ReactNode } from "react";

export enum HeadingType {
	ONE,
	TWO,
	THREE,
	FOUR,
	FIVE
}

export interface HeadingProps {
	id?: string;
	className?: string;
	type: HeadingType;
	children: ReactNode;
}

export default function Heading({ id, className, type, children }: HeadingProps) {
	return type === HeadingType.ONE ? (
		<h1
			id={id}
			className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}
		>
			{children}
		</h1>
	) : type === HeadingType.TWO ? (
		<h2
			className={cn(
				"scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
				className
			)}
		>
			{children}
		</h2>
	) : type === HeadingType.THREE ? (
		<h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}>
			{children}
		</h3>
	) : type === HeadingType.FOUR ? (
		<h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)}>
			{children}
		</h4>
	) : (
		<h5 className={cn("scroll-m-20 text-lg font-semibold tracking-tight", className)}>
			{children}
		</h5>
	);
}
