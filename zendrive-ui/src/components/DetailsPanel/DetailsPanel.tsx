import { X } from "lucide-react";
import { RootState } from "@store/store";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@elements/IconButton/IconButton";
import { set_details_expanded } from "@store/slice/userSlice";
import Heading, { HeadingType } from "@components/Heading/Heading";

export interface DetailsPanelProps {
	handleChange?: (state: boolean) => void;
}

export default function DetailsPanel({ handleChange }: DetailsPanelProps) {
	const { activeMetafile } = useSelector((state: RootState) => state.fileTable);
	const { detailsExpanded } = useSelector((state: RootState) => state.user);

	const dispatch = useDispatch();

	function internalHandleChange(state: boolean) {
		dispatch(set_details_expanded(state));
	}

	return (
		<div
			className={`relative flex h-full bg-muted rounded-md box-border ${
				detailsExpanded ? "w-3/12" : "w-0"
			}`}
			style={{
				transition: "width 0.3s ease-in-out"
			}}
		>
			<div className="flex flex-col items-center w-full h-full p-4">
				<div className="flex justify-between items-center w-full">
					<div className="cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
						<Heading type={HeadingType.FIVE}>{activeMetafile?.name}</Heading>
					</div>

					<IconButton
						className="cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
						variant="ghost"
						onClick={() => {
							internalHandleChange(false);
							handleChange && handleChange(false);
						}}
					>
						<X className="h-6 w-6" />
						<span className="sr-only">Close</span>
					</IconButton>
				</div>
				<div>test</div>
			</div>
		</div>
	);
}
