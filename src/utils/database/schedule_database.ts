import { IScheduleData, ISetData, ITaskData, taskRef } from '../custom_types';
import { Database } from './database';
import { Storage } from '@ionic/storage';


export class Schedule_database {
    schedule: IScheduleData = {
        "monday": [],
        "tuesday": [],
        "wednesday": [],
        "thursday": [],
        "friday": [],
        "saturday": [],
        "sunday": []
    }
    store: Storage;

    constructor(app_database: Database) {
        this.store = app_database.store
        this.createScheduleDB()
            .then(() => this.resetTaskSetCompletenss())
            .then(() => this.getSchedule())
        this.store.get('schedule').then((result: any) => {
            console.log('schedule', result)
        })
    }

    getTodaysName = () => {
        return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date).toLowerCase()
    }

    createScheduleDB = async () => {
        const keys = await this.store.keys()
        if (keys.find(key => key == "schedule") == undefined) {
            await this.store.set("schedule", this.schedule)
        }
    }

    resetTaskSetCompletenss = async () => {
        let newSchedule: IScheduleData = await this.store.get("schedule")
        const today = this.getTodaysName()

        Object.keys(newSchedule).forEach((day: string) => {
            if (day != today) {

                Object.keys(newSchedule[day]).forEach((set: any) => {
                    let exsistingTasks = []
                    if (newSchedule[day][set]) exsistingTasks = newSchedule[day][set].tasks

                    const newRecord = {
                        completed: false,
                        tasks: exsistingTasks
                    }
                    newSchedule[day][set] = newRecord
                });
            }
        });
        await this.store.set("schedule", newSchedule)
    }

    getSchedule = async () => {
        return await this.store.get("schedule") ?? this.schedule
    }

    getScheduleForSet = async (setId: string) => {
        let retrivedSchedule: IScheduleData = await this.store.get("schedule")
        let listOfDays = []
        Object.keys(retrivedSchedule).forEach((day: string) => {
            if (retrivedSchedule[day][setId]) listOfDays.push(day)
        })
    }

    completeTaskInSetSchedule = async (completedTaskId: string, setId: string) => {
        var newSchedule: IScheduleData = await this.store.get("schedule")
        const today = this.getTodaysName()
        newSchedule[today][setId].tasks[completedTaskId].completed = true

        //check off set if all tasks are done
        let setTasks = newSchedule[today][setId].tasks
        let foundUncompletedTask = Object.keys(setTasks).findIndex((taskKey: string) => setTasks[taskKey].completed == false)
        if (foundUncompletedTask == -1) {
            const newRecord = {
                completed: true,
                tasks: setTasks
            }
            newSchedule[today][setId] = newRecord
        }
        return await this.store.set("schedule", newSchedule)
    }

    updateSchedule = async (day: string, id: string, value: object) => {
        var newSchedule: IScheduleData = await this.store.get("schedule")
        newSchedule[day][id] = value
        await this.store.set("schedule", newSchedule)
    }

    removeTaskInSchedule = async (setId: string, taskId: string) => {
        var retrivedSchedule: IScheduleData = await this.store.get("schedule")

        Object.keys(retrivedSchedule).forEach((day: string) => {
            let exsistingTasks: any = []
            if (retrivedSchedule[day][setId]) {
                delete retrivedSchedule[day][setId].tasks[taskId]
                exsistingTasks = { ...retrivedSchedule[day][setId].tasks }
            }

            //see if set is now complete
            let isSetCompleted = Object.keys(exsistingTasks).find((taskRef: any) => exsistingTasks[taskRef].completed == false) ? false : true
            if (Object.keys(exsistingTasks).length > 0) {
                const newRecord = {
                    completed: isSetCompleted,
                    tasks: exsistingTasks
                }

                retrivedSchedule[day][setId] = newRecord
            } else {
                delete retrivedSchedule[day][setId]
            }
        });

        return await this.store.set("schedule", retrivedSchedule)
    }

    deleteSetInSchedule = async (setName: string) => {
        var retrivedSchedule: IScheduleData = await this.store.get("schedule")

        Object.keys(retrivedSchedule).forEach((day: string) => {
            if (retrivedSchedule[day][setName]) {
                delete retrivedSchedule[day][setName]
            }
        });

        return await this.store.set("schedule", retrivedSchedule)
    }

    replaceSetInSchedule = async (oldSetId: string, newSetId: string) => {
        var retrivedSchedule: IScheduleData = await this.store.get("schedule")

        Object.keys(retrivedSchedule).forEach((day: string) => {
            if (retrivedSchedule[day][oldSetId]) {
                retrivedSchedule[day][newSetId] = retrivedSchedule[day][oldSetId]
                delete retrivedSchedule[day][oldSetId]
            }
        });

        return await this.store.set("schedule", retrivedSchedule)
    }

    addSetToSchedule = async (set: string, daysOfWeek: [], taskId: string) => {
        var newSchedule: IScheduleData = await this.store.get("schedule")

        daysOfWeek.forEach((day: string) => {
            let exsistingTasks = []
            if (newSchedule[day][set]) exsistingTasks = newSchedule[day][set].tasks
            exsistingTasks[taskId] = { completed: false }

            const newRecord = {
                completed: false,
                tasks: exsistingTasks

            }
            newSchedule[day][set] = newRecord
        });

        await this.store.set("schedule", newSchedule)
    }
}
