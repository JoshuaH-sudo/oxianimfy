import { Task_database } from './task_database'
import { Schedule_database } from './schedule_database'
import { Database } from './application_database'
import { ITaskData } from '../custom_types';
import { Storage } from '@ionic/storage';

export class Database_manager {
    app_db: Database
    task_db: Task_database
    schedule_db: Schedule_database
    app_storage: Storage

    constructor() {
        this.app_db = new Database()
        this.task_db = new Task_database(this.app_db)
        this.schedule_db = new Schedule_database(this.app_db)
        this.app_storage = this.app_db.store
    }

    addTaskToDB = (newTask: ITaskData) => {
        return new Promise((resolve, reject) => {
            this.task_db.addTask(newTask).then(() => {
                this.schedule_db.addTaskToSchedule(newTask).then(() => {
                    this.app_storage.get("schedule").then((result) => {
                        console.log(result)
                    })
                    resolve(true)
                })
            }).catch(error => {
                reject(error)
            })
        })
    }

    getTasksFromDB = () => {
        return new Promise((resolve, reject) => {
            this.task_db.getTasks().then((tasks: ITaskData[]) => {
                resolve(tasks)
            }).catch(error => {
                reject(error)
            })
        })
    }
}