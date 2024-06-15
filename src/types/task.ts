export interface TaskInfo {
    id: number;
    taskId: number;
    startDate: Date;
    endDate: Date;
    status: string;
    priority: string;
    comments: string;
}
export interface TaskInfoCreation {
    taskId: number;
    startDate: Date;
    endDate: Date;
    status: string;
    priority: string;
    comments: string;
}