import { Files } from "@pages/Files/Files";
import { FilePage } from "@components/FilePage/FilePage";

import "./Overview.scss";

export function Overview() {
	return (
		<FilePage title="Files">
			<Files />
		</FilePage>
	);
}
