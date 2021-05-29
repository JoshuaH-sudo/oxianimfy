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
        return await this.store.get("schedule")
    }

    getScheduleForSet = async (setId: string) => {
        let retrivedSchedule: IScheduleData = await this.store.get("schedule")
        let listOfDays = []
        Object.keys(retrivedSchedule).forEach((day: string) => {
            if (retrivedSchedule[day][setId]) listOfDays.push(day)
        })
    }

    completeSetSchedule = async (setId: string) => {
        var newSchedule: IScheduleData = await this.store.get("schedule")
        const today = this.getTodaysName()
        
        let exsistingTasks = [] 
        if (newSchedule[today][setId]) exsistingTasks = newSchedule[today][setId].tasks
        
        const newRecord = {
            completed: true,
            tasks: exsistingTasks
        }
        newSchedule[today][setId] = newRecord
        await this.store.set("schedule", newSchedule)
    }

    updateSchedule = async (day: string, id: string, value: object) => {
        var newSchedule: IScheduleData = await this.store.get("schedule")
        newSchedule[day][id] = value
        await this.store.set("schedule", newSchedule)
    }

    removeTaskInSchedule =  async (setId: string, taskId: string ) => {
        var retrivedSchedule: IScheduleData = await this.store.get("schedule")

        Object.keys(retrivedSchedule).forEach((day: string) => {
            let exsistingTasks = [] 
            if (retrivedSchedule[day][setId]) exsistingTasks = retrivedSchedule[day][setId].tasks
            exsistingTasks = exsistingTasks.filter((exsistingId: string) => exsistingId != taskId)
            
            if (exsistingTasks != []) {
                const newRecord = {
                    completed: false,
                    tasks: exsistingTasks
                }
    
                retrivedSchedule[day][setId] = newRecord
            } else {
                delete retrivedSchedule[day][setId]
                console.log('yeet', retrivedSchedule[day][setId])
            }
        });

        return await this.store.set("schedule", retrivedSchedule)
    }

    addSetToSchedule = async (set: string, daysOfWeek: [], taskId: string) => {
        var newSchedule: IScheduleData = await this.store.get("schedule")

        daysOfWeek.forEach((day: string) => {
            let exsistingTasks = [] 
            if (newSchedule[day][set]) exsistingTasks = newSchedule[day][set].tasks
            console.log(newSchedule[day][set])
            exsistingTasks.push(taskId)
            
            const newRecord = {
                completed: false,
                tasks: exsistingTasks

            }
            newSchedule[day][set] = newRecord
        });

        await this.store.set("schedule", newSchedule)
    }
}
