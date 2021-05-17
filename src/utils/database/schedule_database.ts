import { IScheduleData, ITaskData } from '../custom_types';
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
            .then(() => this.resetTaskCompletenss())
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

    resetTaskCompletenss = async () => {
        let newSchedule: IScheduleData = await this.store.get("schedule")
        const today = this.getTodaysName()
        
        Object.keys(newSchedule).forEach((day: string) => {
            if (day != today) {

                Object.keys(newSchedule[day]).forEach((task: any) => {
                    const newRecord = {
                        completed: false
                    }
                    newSchedule[day][task] = newRecord
                });
            }
        });
        await this.store.set("schedule", newSchedule)
    }

    getTasksFromSchedule = async () => {
        return await this.store.get("schedule")
    }

    updateSchedule = async (day: string, id: string, value: object) => {
        var newSchedule: IScheduleData = await this.store.get("schedule")
        newSchedule[day][id] = value
        await this.store.set("schedule", newSchedule)
    }

    addTaskToSchedule = async (task: ITaskData) => {
        var newSchedule: IScheduleData = await this.store.get("schedule")
        task.daysOfWeek.forEach((day: string) => {
            const newRecord = {
                completed: false
            }
            newSchedule[day][task.id] = newRecord
        });

        await this.store.set("schedule", newSchedule)
    }
}
