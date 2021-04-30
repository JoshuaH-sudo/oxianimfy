import { database } from './database'
import { ITaskData } from './custom_types'

export class Task_database {
    task_db: database
    task_list: any[] = []
    constructor() {
        this.task_db = new database()
        this.getTasks().then((result: ITaskData[]) => {
            this.task_list = typeof result == "object" ? result : []
        })
    }

    getTasks = () => {
        return new Promise<any[]>((resolve, reject) => {
            this.task_db.retriveItem('task').then((result: any) => {
                resolve(result)
            }).catch((err: Error) => {
                reject(err)
            })
        })
    }

    addTask = (newTask: any) => {
        return new Promise((resolve, reject) => {
            let newTaskList:any[] = this.task_list
            newTaskList.push(newTask)
            this.task_db.storeItem('task', newTaskList).then(() => {
                resolve(true)
            }).catch((err: Error) => {
                reject(err)
            })
        })
    }
}
