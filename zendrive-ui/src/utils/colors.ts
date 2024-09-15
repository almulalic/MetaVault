import { TaskLogLevel, TaskState } from "@apiModels/task/Task";

export const taskProgressColor: Record<TaskState, string> = {
	[TaskState.AWAITING]: "bg-gray-400",
	[TaskState.DELETED]: "bg-red-400",
	[TaskState.ENQUEUED]: "bg-blue-400 text-blue-400",
	[TaskState.FAILED]: "bg-red-400",
	[TaskState.PROCESSING]: "bg-yellow-400",
	[TaskState.SCHEDULED]: "bg-purple-400",
	[TaskState.SUCCEEDED]: "bg-green-400"
};

export const taskStateColor: Record<TaskState, string> = {
	[TaskState.AWAITING]: "border-gray-400 text-gray-400",
	[TaskState.DELETED]: "border-red-400 text-red-400",
	[TaskState.ENQUEUED]: "border-blue-400 text-blue-400",
	[TaskState.FAILED]: "border-red-400 text-red-400",
	[TaskState.PROCESSING]: "border-yellow-400 text-yellow-400",
	[TaskState.SCHEDULED]: "border-purple-400 text-purple-400",
	[TaskState.SUCCEEDED]: "border-green-400 text-green-400"
};

export const logLevelColor: Record<TaskLogLevel, string> = {
	[TaskLogLevel.ERROR]: "border-red-400 text-red-400",
	[TaskLogLevel.WARNING]: "border-yellow-400 text-yellow-400",
	[TaskLogLevel.INFO]: "border-blue-400 text-blue-400"
};
