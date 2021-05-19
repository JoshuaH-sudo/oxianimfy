export interface ITaskData {
    [k: string]: any,
    name: string,
    desc: string,
    [index: number]: { day: string };
    mesure: string | any,
    unit: number | string

}

export interface setRef {
    [k: string]: any,
    name: string,
    desc: string,
    [index: number]: { taskId: string, completed: boolean };
}

export interface ISetData {
    [index: string]: any | setRef,
}

export interface taskRef {
    taskId: string,
    completed: boolean
}

export interface IScheduleData {
    [index: string]: any | taskRef,
}