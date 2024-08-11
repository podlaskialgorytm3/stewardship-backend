export interface TaskInfo {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: string;
    priority: string;
    comments: string;
}
export interface TaskInfoCreation {
    ['task-name']: string;
    ['start-date']: Date;
    ['end-date']: Date;
    status: string;
    priority: string;
    comments: string;
}
export interface SubtaskCreation {
    title: string;
    description: string;
    status: string;
}
export interface TaskAffilationsCreation {
    memberId: string;
}