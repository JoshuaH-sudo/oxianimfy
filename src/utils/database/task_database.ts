import { ITaskData, ISetData } from '../custom_types';
import { Database } from './database';
import { v4 } from 'uuid'
import { Storage } from '@ionic/storage';
export class Task_database {
    set_list: ISetData = {
        "misc": []
    }
    
    store: Storage;

    constructor(app_database: Database) {
        this.store = app_database.store
        this.setTaskSet()
    }

    getTasks = async () => {
        return await this.store.get('task');
    }

    setTaskSet = async () => {
        let keys = await this.store.keys()
        if (keys.find(key => key == 'task_set')) {
            await this.store.set('task_set', this.set_list)
        }
    }

    getTaskSet = async () => {
        return this.store.get('task_set')
    }

    findTask = async (scheduleId: string) => {
        let taskList: ITaskData[] = await this.store.get('task');
        return taskList.find((task: ITaskData) => task.id == scheduleId)
    }

    getSets = async () => {
        return await this.store.get('task_set')
    }

    addSet = async (name: string, desc: string) => {

    }

    addTask = async (newTask: ITaskData, group: string) => {

        let newSetList: ISetData = await this.store.get('task') ?? this.set_list
        newTask.id = v4();
        newSetList[group].push(newTask)
        return await this.store.set('task', newSetList)

    }
}
