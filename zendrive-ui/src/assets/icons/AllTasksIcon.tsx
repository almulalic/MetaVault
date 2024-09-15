import { cn } from "@utils/utils";

export default function AllTasksIcon({ className }: { className?: string }) {
	return (
		<svg
			className={cn("lucide", className)}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4.5 10H4C3.46957 10 2.96086 9.78929 2.58579 9.41421C2.21071 9.03914 2 8.53043 2 8V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H20C20.5304 2 21.0391 2.21071 21.4142 2.58579C21.7893 2.96086 22 3.46957 22 4V8C22 8.53043 21.7893 9.03914 21.4142 9.41421C21.0391 9.78929 20.5304 10 20 10H19.5"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4.5 14H4C3.46957 14 2.96086 14.2107 2.58579 14.5858C2.21071 14.9609 2 15.4696 2 16V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H20C20.5304 22 21.0391 21.7893 21.4142 21.4142C21.7893 21.0391 22 20.5304 22 20V16C22 15.4696 21.7893 14.9609 21.4142 14.5858C21.0391 14.2107 20.5304 14 20 14H19.5"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M6 6H6.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M6 18H6.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<g clipPath="url(#clip0_1_3)">
				<path
					d="M16.625 12.5C16.625 11.406 16.1904 10.3568 15.4168 9.58318C14.6432 8.8096 13.594 8.375 12.5 8.375C11.3468 8.37934 10.2399 8.82931 9.41083 9.63083L8.375 10.6667"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M8.375 8.375V10.6667H10.6667"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M8.375 12.5C8.375 13.594 8.8096 14.6432 9.58318 15.4168C10.3568 16.1904 11.406 16.625 12.5 16.625C13.6532 16.6207 14.7601 16.1707 15.5892 15.3692L16.625 14.3333"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M14.3333 14.3333H16.625V16.625"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_1_3">
					<rect width="11" height="11" fill="white" transform="translate(7 7)" />
				</clipPath>
			</defs>
		</svg>
	);
}
