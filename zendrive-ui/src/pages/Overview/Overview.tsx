import { AllFiles } from "@pages/AllFiles/AllFiles";
import { FilePage } from "@components/FilePage/FilePage";

import "./Overview.scss";

export function Overview() {
	return (
		<FilePage title="Files">
			<AllFiles />
		</FilePage>
	);
}
