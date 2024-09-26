import { Button } from "@elements/ui/button";
import { ReactNode } from "react";

type ButtonWithIconProps = {
	icon: string | ReactNode;
	label: string;
	onClick?: () => void;
	href?: string;
};

export function ButtonWithIcon({ icon, label, onClick, href }: ButtonWithIconProps) {
	return (
		<a onClick={onClick} className="cursor-pointer" href={href}>
			<Button variant="ghost" className="w-full flex gap-2 justify-start text-sm">
				{icon}
				{label}
			</Button>
		</a>
	);
}
