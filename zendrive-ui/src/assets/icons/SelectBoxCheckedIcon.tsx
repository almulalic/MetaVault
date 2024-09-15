import { cn } from "@utils/utils";

export default function SelectBoxCheckedIcon({ className }: { className?: string }) {
	return (
		<svg
			className={cn("lucide", className)}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M8 5H4C3.44772 5 3 5.44772 3 6V10C3 10.5523 3.44772 11 4 11H8C8.55228 11 9 10.5523 9 10V6C9 5.44772 8.55228 5 8 5Z"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8 5H4C3.44772 5 3 5.44772 3 6V10C3 10.5523 3.44772 11 4 11H8C8.55228 11 9 10.5523 9 10V6C9 5.44772 8.55228 5 8 5Z"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M3 17L5 19L9 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M13 6H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M13 12H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M13 18H21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}
