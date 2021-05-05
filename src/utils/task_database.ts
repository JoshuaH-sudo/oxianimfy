import { ITaskData } from './custom_types'
import { Storage } from '@ionic/storage';

export class Task_database {
    task_list: any[] = []
    store:Storage = new Storage();

    constructor() {
        this.createStorage()

        this.getTasks().then((result: ITaskData[]) => {
            this.task_list = (typeof result == "object" && result != null) ? result : []
        })
    }

    async createStorage() {
        await this.store.create()
    }

    getTasks = () => {
        return new Promise<any[]>(async (resolve, reject) => {
            await this.store.get('task').then((result: any) => {
                resolve(result)
            }).catch((err: Error) => {
                reject(err)
            })
        })
    }

    addTask = (newTask: any) => {
        return new Promise(async (resolve, reject) => {
            let newTaskList:any[] = this.task_list
            newTaskList.push(newTask)
            await this.store.set('task', newTaskList).then(() => {
                resolve(true)
            }).catch((err: Error) => {
                reject(err)
            })
        })
    }
}
