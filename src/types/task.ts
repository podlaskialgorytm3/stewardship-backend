export interface TaskInfo {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    status: string;
    priority: string;
    comments: string;
}
export interface TaskInfoCreation {
    name: string;
    startDate: Date;
    endDate: Date;
    status: string;
    priority: string;
    comments: string;
}