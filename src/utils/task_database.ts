import { ITaskData } from './custom_types';
import { Storage } from '@ionic/storage';
import { v4 } from 'uuid'
export class Task_database {
    task_list: any[] = []
    store:Storage = new Storage();

    constructor() {
        this.createStorage()
        this.clearStorage()
        this.getTasks().then((result: ITaskData[]) => {
            this.task_list = (typeof result == "object" && result != null) ? result : []
        })
    }

    async clearStorage() {
        await this.store.clear();
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
            newTask.id = v4()
            newTaskList.push(newTask)
            await this.store.set('task', newTaskList).then(() => {
                resolve(true)
            }).catch((err: Error) => {
                reject(err)
            })
        })
    }
}
