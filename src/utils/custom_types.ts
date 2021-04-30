export interface ITaskData {
    [k: string]: any,
    name: string,
    desc: string,
    [index: number]: { day: string };
    mesure: string | any,
    unit: number | string

}