import { IScheduleData, ISetData, ITaskData } from '../custom_types';
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
                    const newRecord = {
                        completed: false
                    }
                    newSchedule[day][set] = newRecord
                });
            }
        });
        await this.store.set("schedule", newSchedule)
    }

    getSchedule = async () => {
        return await this.store.get("schedule")
    }

    completeSetSchedule = async (setId: string) => {
        var newSchedule: IScheduleData = await this.store.get("schedule")
        const today = this.getTodaysName()
        
        const newRecord = {
            completed: true
        }
        newSchedule[today][setId] = newRecord
        await this.store.set("schedule", newSchedule)
    }

    updateSchedule = async (day: string, id: string, value: object) => {
        var newSchedule: IScheduleData = await this.store.get("schedule")
        newSchedule[day][id] = value
        await this.store.set("schedule", newSchedule)
    }

    addSetToSchedule = async (set: string, daysOfWeek: []) => {
        var newSchedule: IScheduleData = await this.store.get("schedule")
        daysOfWeek.forEach((day: string) => {
            const newRecord = {
                completed: false
            }
            newSchedule[day][set] = newRecord
        });

        await this.store.set("schedule", newSchedule)
    }
}
