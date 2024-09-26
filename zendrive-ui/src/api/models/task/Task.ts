import { ScanTaskParameters } from "./parameters/ScanTaskParameters";

export class Task {
	id: string;
	version: number;
	data: TaskData;
	signature: string;
	state: TaskState;
	createdAt: string;
	updatedAt: string;
	scheduledAt?: string;

	constructor(
		id: string,
		version: number,
		data: TaskData,
		signature: string,
		state: TaskState,
		createdAt: string,
		updatedAt: string,
		scheduledAt?: string
	) {
		this.id = id;
		this.version = version;
		this.data = data;
		this.signature = signature;
		this.state = state;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.scheduledAt = scheduledAt;
	}
}

export class TaskData {
	id: string;
	version: number;
	signature: string;
	name: string;
	labels: string[];
	details: TaskDetails;
	history: TaskHistoryItem[];
	metadata: TaskMetadata;
	recurringTaskId?: string;
	scheduleExpression?: string;
	zoneId?: string;

	constructor(
		id: string,
		version: number,
		taskSignature: string,
		taskName: string,
		labels: any[],
		taskDetails: TaskDetails,
		taskHistory: TaskHistoryItem[],
		metadata: TaskMetadata,
		recurringTaskId?: string,
		scheduleExpression?: string,
		zoneId?: string
	) {
		this.id = id;
		this.version = version;
		this.signature = taskSignature;
		this.name = taskName;
		this.labels = labels;
		this.details = taskDetails;
		this.history = taskHistory;
		this.metadata = metadata;
		this.recurringTaskId = recurringTaskId;
		this.scheduleExpression = scheduleExpression;
		this.zoneId = zoneId;
	}
}

export class TaskDetails {
	className: string;
	methodName: string;
	cacheable: boolean;
	taskParameters: TaskParameter[];

	constructor(
		className: string,
		methodName: string,
		cacheable: boolean,
		taskParameters: TaskParameter[]
	) {
		this.className = className;
		this.methodName = methodName;
		this.cacheable = cacheable;
		this.taskParameters = taskParameters;
	}
}

export type TaskRequest = ScanTaskParameters;

export class TaskParameter {
	className: string;
	actualClassName: string;
	object: TaskRequest;

	constructor(className: string, actualClassName: string, object: TaskRequest) {
		this.className = className;
		this.actualClassName = actualClassName;
		this.object = object;
	}
}

export enum TaskState {
	AWAITING = "AWAITING",
	DELETED = "DELETED",
	ENQUEUED = "ENQUEUED",
	FAILED = "FAILED",
	PROCESSING = "PROCESSING",
	SCHEDULED = "SCHEDULED",
	SUCCEEDED = "SUCCEEDED"
}

export enum TaskLogLevel {
	ERROR = "ERROR",
	WARNING = "WARNING",
	INFO = "INFO"
}

export class TaskHistoryItem {
	createdAt: string; // ISO 8601 string string
	updatedAt?: string; // ISO 8601 string string, optional
	state: TaskState;
	serverId?: string; // Optional
	serverName?: string; // Optional
	latencyDuration?: number; // Optional
	processDuration?: number; // Optional

	constructor(
		createdAt: string,
		state: TaskState,
		updatedAt?: string,
		serverId?: string,
		serverName?: string,
		latencyDuration?: number,
		processDuration?: number
	) {
		this.createdAt = createdAt;
		this.state = state;
		this.updatedAt = updatedAt;
		this.serverId = serverId;
		this.serverName = serverName;
		this.latencyDuration = latencyDuration;
		this.processDuration = processDuration;
	}
}

export class TaskMetadata {
	taskRunrDashboardLog?: TaskDashboardLog;
	taskRunrDashboardProgressBar: TaskDashboardProgress;

	constructor(
		taskRunrDashboardLog: TaskDashboardLog,
		taskRunrDashboardProgressBar: TaskDashboardProgress
	) {
		this.taskRunrDashboardLog = taskRunrDashboardLog;
		this.taskRunrDashboardProgressBar = taskRunrDashboardProgressBar;
	}
}

export class TaskDashboardLog {
	logLines: TaskLogLine[];

	constructor(logLines: TaskLogLine[]) {
		this.logLines = logLines;
	}
}

export class TaskLogLine {
	level: TaskLogLevel;
	logInstant: string; // ISO 8601 string string
	logMessage: string;

	constructor(level: TaskLogLevel, logInstant: string, logMessage: string) {
		this.level = level;
		this.logInstant = logInstant;
		this.logMessage = logMessage;
	}
}

export class TaskDashboardProgress {
	totalAmount: number;
	succeededAmount: number;
	failedAmount: number;
	progress: number;

	constructor(
		totalAmount: number,
		succeededAmount: number,
		failedAmount: number,
		progress: number
	) {
		this.totalAmount = totalAmount;
		this.succeededAmount = succeededAmount;
		this.failedAmount = failedAmount;
		this.progress = progress;
	}
}

export const TaskRunningStates: TaskState[] = [
	TaskState.SCHEDULED,
	TaskState.AWAITING,
	TaskState.ENQUEUED,
	TaskState.PROCESSING
];
