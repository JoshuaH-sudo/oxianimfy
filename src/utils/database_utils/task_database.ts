import { ITaskData } from '../custom_types';
import { Database } from './database';
import { v4 } from 'uuid'
import { Storage } from '@ionic/storage';
export class Task_database {
    task_list: ITaskData[] = []
    store:Storage;

    constructor(app_database: Database) {
        this.store =  app_database.store
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

    addTask = (newTask: ITaskData) => {
        return new Promise(async (resolve, reject) => {
            let newTaskList:ITaskData[] = this.task_list
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
