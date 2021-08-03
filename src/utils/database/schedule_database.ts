import { IScheduleData, ISetData, ITaskData, taskRef } from "../custom_types";
import { Database } from "./database";
import { Storage } from "@ionic/storage";

export class Schedule_database {
  schedule: IScheduleData = {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  };
  store: Storage;

  constructor(app_database: Database) {
    this.store = app_database.store;
    this.createScheduleDB()
      .then(() => this.resetTaskSetCompleteness())
      .then(() => this.getSchedule());
    this.store.get("schedule").then((result: any) => {
      console.log("schedule", result);
    });
  }

  getTodaysName = () => {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" })
      .format(new Date())
      .toLowerCase();
  };

  createScheduleDB = async () => {
    const keys = await this.store.keys();
    if (keys.find((key) => key == "schedule") == undefined) {
      await this.store.set("schedule", this.schedule);
    }
  };

  resetTaskSetCompleteness = async () => {
    let newSchedule: IScheduleData = await this.store.get("schedule") ?? this.schedule;
    const today = this.getTodaysName();

    if (newSchedule)
      Object.keys(newSchedule).forEach((day: string) => {
        if (day != today) {
          Object.keys(newSchedule[day]).forEach((set: any) => {
            let existingTasks = [];
            if (newSchedule[day][set])
              existingTasks = newSchedule[day][set].tasks;

            const newRecord = {
              completed: false,
              tasks: existingTasks,
            };
            newSchedule[day][set] = newRecord;
          });
        }
      });
    await this.store.set("schedule", newSchedule);
  };

  getSchedule = async () => {
    return (await this.store.get("schedule")) ?? this.schedule;
  };

  getScheduleForSet = async (setId: string) => {
    let retrievedSchedule: IScheduleData = await this.store.get("schedule");
    let listOfDays = [];
    Object.keys(retrievedSchedule).forEach((day: string) => {
      if (retrievedSchedule[day][setId]) listOfDays.push(day);
    });
  };

  completeTaskInSetSchedule = async (
    completedTaskId: string,
    setId: string
  ) => {
    var newSchedule: IScheduleData = await this.store.get("schedule");
    const today = this.getTodaysName();
    newSchedule[today][setId].tasks[completedTaskId].completed = true;

    //check off set if all tasks are done
    let setTasks = newSchedule[today][setId].tasks;
    let foundUncompletedTask = Object.keys(setTasks).findIndex(
      (taskKey: string) => setTasks[taskKey].completed == false
    );
    if (foundUncompletedTask == -1) {
      const newRecord = {
        completed: true,
        tasks: setTasks,
      };
      newSchedule[today][setId] = newRecord;
    }
    return await this.store.set("schedule", newSchedule);
  };

  updateSchedule = async (day: string, id: string, value: object) => {
    var newSchedule: IScheduleData = await this.store.get("schedule");
    newSchedule[day][id] = value;
    await this.store.set("schedule", newSchedule);
  };

  removeTaskInSchedule = async (setId: string, taskId: string) => {
    var retrievedSchedule: IScheduleData = await this.store.get("schedule");

    Object.keys(retrievedSchedule).forEach((day: string) => {
      let existingTasks: any = [];
      if (retrievedSchedule[day][setId]) {
        delete retrievedSchedule[day][setId].tasks[taskId];
        existingTasks = { ...retrievedSchedule[day][setId].tasks };
      }

      //see if set is now complete
      let isSetCompleted = Object.keys(existingTasks).find(
        (taskRef: any) => existingTasks[taskRef].completed == false
      )
        ? false
        : true;
      if (Object.keys(existingTasks).length > 0) {
        const newRecord = {
          completed: isSetCompleted,
          tasks: existingTasks,
        };

        retrievedSchedule[day][setId] = newRecord;
      } else {
        delete retrievedSchedule[day][setId];
      }
    });

    return await this.store.set("schedule", retrievedSchedule);
  };

  deleteSetInSchedule = async (setName: string) => {
    var retrievedSchedule: IScheduleData = await this.store.get("schedule");

    Object.keys(retrievedSchedule).forEach((day: string) => {
      if (retrievedSchedule[day][setName]) {
        delete retrievedSchedule[day][setName];
      }
    });

    return await this.store.set("schedule", retrievedSchedule);
  };

  replaceSetInSchedule = async (oldSetId: string, newSetId: string) => {
    var retrievedSchedule: IScheduleData = await this.store.get("schedule");

    Object.keys(retrievedSchedule).forEach((day: string) => {
      if (retrievedSchedule[day][oldSetId]) {
        retrievedSchedule[day][newSetId] = retrievedSchedule[day][oldSetId];
        delete retrievedSchedule[day][oldSetId];
      }
    });

    return await this.store.set("schedule", retrievedSchedule);
  };

  addSetToSchedule = async (set: string, daysOfWeek: any[], taskId: string) => {
    var newSchedule: IScheduleData = await this.store.get("schedule");

    daysOfWeek.forEach((day: string) => {
      let existingTasks = [];
      if (newSchedule[day][set]) existingTasks = newSchedule[day][set].tasks;
      existingTasks[taskId] = { completed: false };

      const newRecord = {
        completed: false,
        tasks: existingTasks,
      };
      newSchedule[day][set] = newRecord;
    });

    await this.store.set("schedule", newSchedule);
  };
}
