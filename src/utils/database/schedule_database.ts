import { IScheduleData, ITaskData } from '../custom_types';
import { Database } from './application_database';
import { v4 } from 'uuid'
import { Storage } from '@ionic/storage';


export class Schedule_database {
    schedule: IScheduleData = {
        "monday": [],
        "tueday": [],
        "wenday": [],
        "thursday": [],
        "friday": [],
        "saturday": [],
        "sunday": []
    }
    store: Storage;

    constructor(app_database: Database) {
        this.store = app_database.store
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
            if (keys.find(key => key == "schedule") == undefined) {
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

    addTaskToSchedule = async (task: ITaskData) => {
        var newSchedule:IScheduleData = this.schedule
        task.daysOfWeek.forEach((day: string) => {
            const newRecord = {
                uuid: task.id,
                completed: false
            }
            newSchedule[day].push(newRecord)
        });

        await this.store.set("schedule", newSchedule)
    }
}
