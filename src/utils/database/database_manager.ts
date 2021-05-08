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

    addTaskToDB = (newTask: ITaskData) => {
        return new Promise((resolve, reject) => {
            this.task_db.addTask(newTask).then(() => {
                this.schedule_db.addTaskToSchedule(newTask).then(() => {
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

    getTasksFromDBForToday = () => {
        return new Promise((resolve, reject) => {

            var retrivedTaskLists: ITaskData[] = []

            this.schedule_db.getTasksFromSchedule().then((scheduleData: IScheduleData) => {

                let taskIdsList: IScheduleData = scheduleData
                let today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date).toLowerCase()
                console.log(taskIdsList)

                taskIdsList[today].forEach((task: taskRef) => {
                    this.task_db.findTask(task.uuid).then(foundTask => {
                        if (foundTask) {
                            retrivedTaskLists.push(foundTask)
                        }
                    })
                })
                
                resolve(retrivedTaskLists)

            }).catch((error) => {
                reject(error)
            })

        })
    }
}