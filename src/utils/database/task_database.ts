import { ITaskData } from '../custom_types';
import { Database } from './database';
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

    getTasks = async ()  => {
        return await this.store.get('task');
    }

    findTask = async (id: string) => {
        return this.task_list.find((task) => task.id == id)
    }

    addTask = async (newTask: ITaskData) => {

        let newTaskList: ITaskData[] = this.task_list
        newTask.id = v4()
        newTaskList.push(newTask)
        return await this.store.set('task', newTaskList)

    }
}
