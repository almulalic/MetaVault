import { AxiosResponse } from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@elements/ui/badge";
import { useEffect, useRef, useState } from "react";
import { TaskService } from "@services/TaskService";
import { FilePage } from "@components/FilePage/FilePage";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useNavigate, useParams } from "react-router-dom";
import { taskStateColor, logLevelColor } from "@utils/colors";
import Heading, { HeadingType } from "@components/Heading/Heading";
import {
	Task,
	TaskHistoryItem,
	TaskLogLine,
	TaskRunningStates,
	TaskState
} from "@apiModels/task/Task";
import { DateTime } from "luxon";
import { cn } from "@utils/utils";
import { RootState } from "@store/store";
import { Label } from "@elements/ui/label";
import { Button } from "@elements/ui/button";
import { Switch } from "@elements/ui/switch";
import { Progress } from "@elements/ui/progress";
import { DATE_TIME_FORMAT } from "@constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { set_follow_log_output } from "@store/slice/userSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@elements/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@elements/ui/tabs";

enum TaskOverviewTabs {
	LOGS,
	HISTORY
}

export default function TaskOverview() {
	const { taskId } = useParams();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { followLogOutput } = useSelector((state: RootState) => state.user);

	const [task, setTask] = useState<Task>();
	const [pollInterval, setPollInterval] = useState<number>(1500);

	const [isLoading, setLoading] = useState(true);

	async function getTaskData(taskId: string) {
		setLoading(true);

		const response: AxiosResponse<Task> = await TaskService.get(taskId);

		if (response.status === 200) {
			setTask(response.data);

			if (
				[TaskState.DELETED, TaskState.FAILED, TaskState.SUCCEEDED].includes(response.data.state)
			) {
				setPollInterval(5000);
			}
		}

		setLoading(false);
	}

	const scrollableLogsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (taskId) {
			getTaskData(taskId);
			const intervalId = setInterval(() => getTaskData(taskId), pollInterval);
			return () => clearInterval(intervalId);
		}
	}, [taskId, pollInterval]);

	if (followLogOutput && scrollableLogsRef && scrollableLogsRef.current) {
		scrollableLogsRef.current.scrollTop = scrollableLogsRef.current.scrollHeight;
	}

	const handleFollowLogOutput = () => {
		dispatch(set_follow_log_output(!followLogOutput));
	};

	return (
		<FilePage title="test">
			<div
				className="flex items-center gap-2 cursor-pointer mt-4 text-muted-foreground transition-colors hover:text-foreground"
				onClick={() => navigate("/tasks")}
			>
				<ArrowLeft className="w-4 h-4" />
				Go Back
			</div>

			<div className="relative flex flex-col justify-between gap-4 w-full overflow-hidden mt-4">
				<div className="flex justify-start items-center gap-2">
					{task && TaskRunningStates.includes(task.state) && (
						<Loader2 className="w-8 h-8 animate-spin" />
					)}

					<Heading
						type={HeadingType.TWO}
						className="whitespace-nowrap flex justify-center items-start gap-4 p-0"
					>
						{task && task.data.name ? task.data.name : `Task ${taskId}`}
					</Heading>
				</div>
				{task && (
					<div className="">
						<Card className="mb-6">
							<CardHeader className="flex w-full gap-4">
								<div className="flex justify-between">
									<div className="flex gap-4">
										{task && (
											<Badge variant="outline" className={cn("my-2", taskStateColor[task.state])}>
												<span className="font-medium text-sm">{task.state}</span>
											</Badge>
										)}

										<div>
											<CardTitle className="text-xxl flex items-center gap-4">
												{task.data.name}
											</CardTitle>
											<p className="text-base text-gray-500">{task.id}</p>
										</div>
									</div>

									<div className="flex justify-between items-center gap-4">
										<Button>Rerun</Button>

										<Button variant="destructive">Delete</Button>
									</div>
								</div>
							</CardHeader>

							<CardContent className="flex flex-col gap-4">
								<div>
									<Progress
										size="md"
										className={cn("h-5 text-xl")}
										value={
											task.data.metadata.taskRunrDashboardProgressBar2
												? task.data.metadata.taskRunrDashboardProgressBar2.progress
												: 0
										}
										max={
											task.data.metadata.taskRunrDashboardProgressBar2
												? task.data.metadata.taskRunrDashboardProgressBar2.totalAmount
												: 10000
										}
									/>
								</div>

								<div className="text-base">
									<p>
										Created:
										<span className="ml-1 text-gray-500">
											{DateTime.fromISO(task.createdAt).toFormat(DATE_TIME_FORMAT)}
										</span>
									</p>
									<p>
										Last Updated:
										<span className="ml-1 text-gray-500">
											{DateTime.fromISO(task.updatedAt).toFormat(DATE_TIME_FORMAT)}
										</span>
									</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<Tabs defaultValue={TaskOverviewTabs.LOGS.toString()}>
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value={TaskOverviewTabs.LOGS.toString()}>Logs</TabsTrigger>
									<TabsTrigger value={TaskOverviewTabs.HISTORY.toString()}>History</TabsTrigger>
								</TabsList>
								<CardContent className="min-h-[400px]">
									<TabsContent value={TaskOverviewTabs.LOGS.toString()}>
										<div className="">
											<div className="w-full flex justify-start gap-4 my-4">
												<div className="flex items-center space-x-2">
													<Switch
														id="follow-log-output"
														checked={followLogOutput}
														onClick={handleFollowLogOutput}
													/>
													<Label htmlFor="follow-log-output">Follow log output</Label>
												</div>
											</div>

											<ScrollArea
												className="h-[400px] px-1 divide-y divide-gray-500 overflow-y-scroll"
												ref={scrollableLogsRef}
											>
												{task.data.metadata.taskRunrDashboardLog2 &&
													task.data.metadata.taskRunrDashboardLog2.logLines.map(
														(log: TaskLogLine, index: number) => (
															<div key={index} className="py-2 flex items-center cursor-pointer">
																<Badge
																	variant="outline"
																	className={`mr-4 ${logLevelColor[log.level]}`}
																>
																	{log.level}
																</Badge>
																<div className="flex-grow">
																	<p>{log.logMessage}</p>
																	<p className="text-xs text-slate-400">
																		{new Date(log.logInstant).toLocaleString()}
																	</p>
																</div>
															</div>
														)
													)}
											</ScrollArea>
										</div>
									</TabsContent>

									<TabsContent
										value={TaskOverviewTabs.HISTORY.toString()}
										className="h-[400px] px-1 divide-y divide-gray-500"
									>
										{task.data.history.map((item: TaskHistoryItem, index: number) => (
											<div key={index} className="py-2 flex gap-4 items-center cursor-pointer">
												<span className="flex min-w-28">
													<Badge variant="outline" className={`${taskStateColor[item.state]}`}>
														{item.state.toUpperCase()}
													</Badge>
												</span>

												<div className="flex-grow">
													{TaskRunningStates.includes(item.state) ? (
														<p className="flex flex-col">
															<div className="flex gap-2">
																{item.serverName}
																<span className="text-gray-500">({item.serverId})</span>
															</div>
															<span className="text-xs text-slate-400">
																{new Date(item.createdAt).toLocaleString()}{" "}
															</span>
														</p>
													) : (
														<p className="text-xs text-slate-400">
															{new Date(item.createdAt).toLocaleString()}
														</p>
													)}
												</div>
											</div>
										))}
									</TabsContent>
								</CardContent>
							</Tabs>
						</Card>
					</div>
				)}
			</div>
		</FilePage>
	);
}
