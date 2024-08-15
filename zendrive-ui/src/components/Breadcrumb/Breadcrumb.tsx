import { Component, Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator
} from "../ui/breadcrumb";

export interface PathBreadcrumb {
	label: string;
	onClick: (item: any) => any;
}

export interface PathBreadcrumbProps {
	components: PathBreadcrumb[];
}

export default function PathBreadcrumb(props: PathBreadcrumbProps) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{props.components.map((breadcrumb: PathBreadcrumb, i: number) => (
					<Fragment key={i}>
						<BreadcrumbItem onClick={breadcrumb.onClick} className="cursor-pointer">
							<BreadcrumbLink>{breadcrumb.label}</BreadcrumbLink>
						</BreadcrumbItem>

						{i < props.components.length && <BreadcrumbSeparator />}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
