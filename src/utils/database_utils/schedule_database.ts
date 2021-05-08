import { ITaskData } from '../custom_types';
import { Database } from './database';
import { v4 } from 'uuid'
import { Storage } from '@ionic/storage';
export class Schedule_database {
    schedule: any = {
        "monday" : {},
        "tueday" : {},
        "wenday" : {},
        "thursday" : {},
        "friday" : {},
        "saturday" : {},
        "sunday" : {}
    }
    store:Storage;
    
    constructor(app_database: Database) {
        this.store =  app_database.store
        this.createScheduleDB()
    }

    async clearStorage() {
        await this.store.clear();
    }

    async createStorage() {
        await this.store.create()
    }

    createScheduleDB = async () => {

        await this.store.keys().then(async (keys) => {
            console.log(keys)
            if (keys.find( key => key == "schedule") == undefined) {
                await this.store.set("schedule", this.schedule)
            } else {
                await this.store.get("schedule").then((result) => {
                    this.schedule = result
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    addTaskToSchedule = (task: ITaskData) => {
        let newSchedule = this.schedule
        task.daysOfWeek.forEach((day: string) => {
            newSchedule[day].push(task.id)
        });
        this.store.set("schedule", newSchedule).then(() => {
            this.store.get("schedule")
        })
    }
}
