import { useEffect } from "react";
import { AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { RootState } from "@store/store";
import { Task } from "@apiModels/task/Task";
import { useNavigate } from "react-router-dom";
import { TaskService } from "@services/task/TaskService";
import { ScrollArea } from "@elements/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { set_running_tasks } from "@store/slice/taskTableSlice";

export default function TasksSection() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { runningTasks, pollInterval } = useSelector((state: RootState) => state.taskTable);

	async function getRunningTasks() {
		const response: AxiosResponse<Task[]> = await TaskService.getRunningTasks();

		if (response.status === 200) {
			dispatch(set_running_tasks(response.data));
		}
	}

	useEffect(() => {
		const intervalId = setInterval(getRunningTasks, pollInterval);
		return () => clearInterval(intervalId);
	}, [runningTasks.length]);

	const renderRunningTask = (task: Task) => {
		return (
			<div
				key={task.id}
				className="cursor-pointer items-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-2 py-2 w-full flex gap-2 justify-start text-sm"
				onClick={() => {
					navigate(`/tasks/${task.id}`);
				}}
			>
				<Loader2 className="animate-spin" />
				{task.data.name}
			</div>
		);
	};

	return <ScrollArea className="px-2">{runningTasks.map((x) => renderRunningTask(x))}</ScrollArea>;
}
