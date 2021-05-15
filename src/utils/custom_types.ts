export interface ITaskData {
    [k: string]: any,
    name: string,
    desc: string,
    [index: number]: { day: string };
    mesure: string | any,
    unit: number | string

}

export interface taskRef {
    [k: string]: any,
    completed: boolean
}

export interface IScheduleData {
    [index: string]: any | taskRef,
}