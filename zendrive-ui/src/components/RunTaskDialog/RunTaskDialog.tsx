import { AxiosResponse } from "axios";
import { Input } from "@elements/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@elements/ui/button";
import { JsonEditor } from "json-edit-react";
import { SquareTerminal } from "lucide-react";
import { toast } from "@elements/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Combobox } from "@elements/ui/combobox";
import { schemaToObject } from "@utils/jsonSchema";
import { TaskService } from "@services/TaskService";
import { AppDispatch, RootState } from "@store/store";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@elements/IconButton/IconButton";
import { TaskDefinition } from "@apiModels/task/TaskDefinition";
import { CreateTaskResponse } from "@apiModels/task/CreateTaskResponse";
import { Dialog, DialogContent, DialogTitle } from "@elements/ui/dialog";
import { reset_run_task_state, set_run_task_loading } from "@store/slice";
import { isValidJson } from "@utils/utils";
import { isFile } from "@utils/metafile";

export default function RunTaskDialog() {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const [dialogOpen, setDialogOpen] = useState<boolean>(false);

	const { activeMetafile } = useSelector((state: RootState) => state.fileTable);
	const { isLoading } = useSelector((state: RootState) => state.runTask);

	const handleDialogOpenChange = (open: boolean) => {
		setDialogOpen(open);

		if (!open) {
			dispatch(reset_run_task_state());
		}
	};

	const [errorMessage, setErrorMessage] = useState("");
	const [taskQuery, setTaskQuery] = useState("");
	const [availableTasksDefinitions, setAvailableTasksDefinitions] = useState<TaskDefinition[]>([]);
	const [selectedTaskDefinition, setSelectedTaskDefinition] = useState<TaskDefinition | null>(null);
	const [taskName, setTaskName] = useState("");
	const [jsonPayload, setJsonPayload] = useState({});

	async function getAvailableTasks(query: string) {
		const response: AxiosResponse<TaskDefinition[]> = await TaskService.getDefinitions(query);

		if (response.status === 200) {
			setAvailableTasksDefinitions(response.data);
		}
	}

	async function runTask(
		name: string,
		definitionId: string,
		payload: object
	): Promise<CreateTaskResponse<any> | null> {
		dispatch(set_run_task_loading(true));

		const response: AxiosResponse<CreateTaskResponse<any>> = await TaskService.run<any>({
			name: name,
			definitionId: definitionId,
			parameters: payload
		});

		if (response.status !== 200) {
			setErrorMessage(response.data.message);
			dispatch(set_run_task_loading(false));
			return null;
		}

		dispatch(set_run_task_loading(false));
		return response.data;
	}

	async function handleRunTaskSubmit() {
		if (!taskName || taskName.length === 0) {
			setErrorMessage("Name must not be empty");
			return;
		} else if (!selectedTaskDefinition) {
			setErrorMessage("Task definition must not be empty");
			return;
		} else if (!jsonPayload || typeof jsonPayload !== "object") {
			setErrorMessage("Task properties must not be empty");
			return;
		}

		const taskResponse: CreateTaskResponse<any> | null = await runTask(
			taskName,
			selectedTaskDefinition.id,
			jsonPayload
		);

		if (taskResponse && taskResponse.id) {
			navigate(`/tasks/${taskResponse.id}`);
		}
	}

	useEffect(() => {
		getAvailableTasks(taskQuery);
	}, [taskQuery]);

	return (
		<Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
			<IconButton
				variant="ghost"
				tooltipContent="Run task"
				onClick={() => handleDialogOpenChange(true)}
			>
				<SquareTerminal className="w-6 h-6" />
			</IconButton>

			<DialogContent className="flex flex-col scroll-auto max-h-70wh">
				<DialogTitle>Run task</DialogTitle>

				<div className="flex w-full">
					<Input
						className=""
						value={taskName}
						onChange={(e) => setTaskName(e.target.value)}
						placeholder="Task name"
					/>
				</div>

				<div className="flex w-full">
					<Combobox
						popoverButtonClassName="w-full"
						popoverClassName="w-full"
						items={availableTasksDefinitions.map((x) => ({ label: x.name, value: x.id }))}
						placeholder="Search tasks..."
						emptyMessage="No task with that query was found."
						onSearchChange={(value) => setTaskQuery(value)}
						onChange={(value) => {
							const definition: TaskDefinition = availableTasksDefinitions.filter(
								(x) => x.id === value
							)[0];
							setSelectedTaskDefinition(definition);
							setJsonPayload(
								schemaToObject(definition.properties, {
									directoryId: isFile(activeMetafile!)
										? activeMetafile?.previous
										: activeMetafile?.id
								})
							);
						}}
					/>
				</div>

				{selectedTaskDefinition && (
					<JsonEditor
						className="json-editor"
						data={jsonPayload}
						theme="githubDark"
						restrictTypeSelection={["array"]}
						restrictAdd
						restrictDelete
						rootName="properties"
						setData={setJsonPayload}
					/>
				)}

				{errorMessage !== "" && <div className="text-red-300">{errorMessage}</div>}

				<div className="w-full flex gap-4 mt-4 select-none">
					<Button className="w-full" disabled={isLoading} onClick={handleRunTaskSubmit}>
						Run Task
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
