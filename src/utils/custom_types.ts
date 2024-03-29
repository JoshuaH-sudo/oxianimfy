export interface ITaskData {
  [k: string]: any;
  name: string;
  desc: string;
  [index: number]: { day: string };
  measure: string | any;
  unit: number | string;
}

export interface setRef {
  [k: string]: any;
  name: string;
  desc: string;
  [index: number]: taskRef;
}

export interface ISetData {
  [index: string]: any | setRef;
}

export interface ITaskSetData {
  [index: string]: any | ITaskData;
}

export interface taskRef {
  taskId: string;
  completed: boolean;
}

export interface streakData {
  id: string;
  streak: number;
}

export interface IScheduleData {
  [index: string]: any | taskRef;
}

export interface ISettings {
  [k: string]: any;
  selectedTaskGroup: string;
}
