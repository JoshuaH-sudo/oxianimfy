import { ITaskData, ISetData, taskRef } from '../custom_types';
import { Database } from './database';
import { v4 } from 'uuid'
import { Storage } from '@ionic/storage';

export class Task_set_database {
    default_set_list: ISetData = {
        misc: {
            key: v4(),
            name: "Misc",
            desc: "The default task set, all tasks that are not in a set go in here",
            tasks: []
        }
    }

    store: Storage;

    constructor(app_database: Database) {
        this.store = app_database.store
        this.store.get('task_set').then((result: any) => {
            console.log('task_set', result)
        })
    }

    resetTaskCompletenss = async (setId: string) => {
        let newSetList = await this.store.get('task_set') ?? this.default_set_list

        newSetList[setId].tasks.map((taskId: taskRef) => {
            taskId.completed = false
        });

        return await this.store.set('task_set', newSetList)
    }

    createSet = async (setName: string, description: string) => {
        let newSetList = await this.store.get('task_set') ?? this.default_set_list
        newSetList[setName.toLocaleLowerCase()] = {
            key: v4(),
            name: setName,
            desc: description,
            tasks: []
        }
        await this.store.set('task_set', newSetList)
    }

    addTaskToSet = async (setId: string, taskId: string) => {
        let newTaskSetList: ISetData = await this.store.get('task_set') ?? this.default_set_list
        console.log('adding task to set', newTaskSetList)
        newTaskSetList[setId].tasks.push({ taskId: taskId, completed: false})
        console.log('adding task to 2', newTaskSetList)

        return await this.store.set('task_set', newTaskSetList)
    }

    getSets = async () => {
        return await this.store.get('task_set') ?? this.default_set_list
    }

    getSetWithId = async (setId: string) => {
        let setList = await this.store.get('task_set') ?? this.default_set_list
        return setList[setId.toLowerCase()]
    }

    getSetsTaskIds = async (setId: string) => {
        let setList = await this.store.get('task_set') ?? this.default_set_list
        return setList[setId.toLowerCase()].tasks
    }
}