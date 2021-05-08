export interface ITaskData {
    [k: string]: any,
    name: string,
    desc: string,
    [index: number]: { day: string };
    mesure: string | any,
    unit: number | string

}

export interface taskRef {
    uuid: string,
    completed: boolean
}

export interface IScheduleData {
    [index: string]: taskRef[],
}