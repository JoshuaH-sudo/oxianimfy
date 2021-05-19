import { Task_database } from './task_database'
import { Schedule_database } from './schedule_database'
import { Database } from './database'
import { IScheduleData, ITaskData, taskRef } from '../custom_types';
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

    addTaskToDB = (newTask: ITaskData, set: string) => {
        return new Promise((resolve, reject) => {
            this.task_db.addTask(newTask, set).then(() => {
                this.schedule_db.addTaskToSchedule(set).then(() => {
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

    completeTask = async (completedTasksId: string) => {
        let today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date).toLowerCase()

        const updatedValue = {
            completed: true
        }

        await this.schedule_db.updateSchedule(today, completedTasksId, updatedValue)
    }

    getTasksFromDBForToday = async () => {
        try {
            let taskIdsList = await this.schedule_db.getTasksFromSchedule()
            const today = this.schedule_db.getTodaysName()

            let promises: any[] = []
            Object.keys(taskIdsList[today]).forEach((taskKey: string) => {
                const entry = taskIdsList[today][taskKey]
                if (entry.completed == false) {
                    promises.push(
                        this.task_db.findTask(taskKey)
                    )
                }
            })
            
            return await Promise.all(promises)
        } catch (error) {
            console.log(error)
        }
    }
}