import { ITaskData } from '../custom_types';
import { Database } from './application_database';
import { v4 } from 'uuid'
import { Storage } from '@ionic/storage';
export class Task_database {
    task_list: ITaskData[] = []
    store: Storage;

    constructor(app_database: Database) {
        this.store = app_database.store
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

    getTasks = async ()  => {
        return await this.store.get('task');
    }

    addTask = async (newTask: ITaskData) => {

        let newTaskList: ITaskData[] = this.task_list
        newTask.id = v4()
        newTaskList.push(newTask)
        return await this.store.set('task', newTaskList)

    }
}
