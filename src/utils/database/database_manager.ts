import { Task_database } from './task_database'
import { Task_set_database } from './task_set_database'
import { Schedule_database } from './schedule_database'
import { Database } from './database'
import { IScheduleData, ITaskData, taskRef } from '../custom_types';
import { Storage } from '@ionic/storage';

export class Database_manager {
    app_db: Database
    task_db: Task_database
    task_set_db: Task_set_database
    schedule_db: Schedule_database
    app_storage: Storage

    constructor() {
        this.app_db = new Database()
        this.task_db = new Task_database(this.app_db)
        this.task_set_db = new Task_set_database(this.app_db)
        this.schedule_db = new Schedule_database(this.app_db)
        this.app_storage = this.app_db.store
    }

    addTaskToDB = (newTask: ITaskData, set: string) => {
        return new Promise((resolve, reject) => {
            this.task_db.addTask(newTask, set).then(() => {

                this.schedule_db.addSetToSchedule(set, newTask.daysOfWeek).then(() => {
                    resolve(true)
                })
            })
                .catch(error => {
                    reject(error)
                })
        })
    }

    getSetsFromDb = async () => {
        return await this.task_set_db.getSets()
    }

    addTaskGroupToDB = async (setId: string, description: string) => {
        return await this.task_set_db.createSet(setId, description)
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

    completeTask = async (completedTasksId: string, setId: string) => {
        await this.task_db.completeTaskInSet(completedTasksId, setId)
        let currentSet = await this.task_set_db.getSetWithId(setId)

        let setNotCompleted = currentSet.tasks.find((task: taskRef) => task.completed == false)
        
        if (!setNotCompleted) await this.schedule_db.completeSetSchedule(setId)
        return await this.task_set_db.resetTaskCompletenss(setId)
    }

    getSetsFromDBForToday = async () => {
        let schedule = await this.schedule_db.getSchedule()
        const today = this.schedule_db.getTodaysName()
        return schedule[today]
    }

    getTasksFromSet = async (taskSet: string) => {
        try {

            let promises: any[] = []
            let taskIdList = await this.task_set_db.getSetsTaskIds(taskSet)
            taskIdList.forEach((entry: taskRef) => {

                if (entry.completed == false) {
                    promises.push(
                        this.task_db.findTask(entry.taskId)
                    )
                }
            })

            return await Promise.all(promises)
        } catch (error) {
            console.log(error)
        }
    }
}