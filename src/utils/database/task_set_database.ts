import { ITaskData, ISetData, taskRef, setRef } from '../custom_types';
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
            console.log('before refresh task_set', result)
        })
    }

    resetTaskCompletenss = async (setId: string) => {
        let newSetList = await this.store.get('task_set') ?? this.default_set_list

        newSetList[setId].tasks.forEach((taskId: taskRef) => {
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
        newTaskSetList[setId].tasks.push({ taskId: taskId, completed: false})

        return await this.store.set('task_set', newTaskSetList)
    }

    getSets = async () => {
        return await this.store.get('task_set') ?? this.default_set_list
    }

    getSetWithId = async (setId: string) => {
        let setList = await this.store.get('task_set') ?? this.default_set_list
        return setList[setId.toLowerCase()]
    }

    getSetWithKey = async (setKey: string) => {
        let setList = await this.store.get('task_set') ?? this.default_set_list
        let foundSetId = Object.keys(setList).find((setId: string) => setList[setId].key == setKey)
        if (foundSetId) return setList[foundSetId]
    }

    getSetsTaskIds = async (setId: string) => {
        let setList = await this.store.get('task_set') ?? this.default_set_list
        return setList[setId.toLowerCase()].tasks
    }

    findSetsBelongingToTask = async (taskId: string) => {
        let setList = await this.store.get('task_set') ?? this.default_set_list
        let foundSets: string[] = []
        Object.keys(setList).forEach((setId: string) => {
            if (setList[setId].tasks.indexOf(taskId) ) foundSets.push(setId)
        })
        return foundSets
    }

    removeTaskFromSet = async (setId: string, taskId: string) => {
        let newTaskSetList = await this.store.get('task_set') ?? this.default_set_list
        newTaskSetList[setId].tasks = newTaskSetList[setId].tasks.filter((taskRef: taskRef) => taskRef.taskId != taskId)

        await this.store.set('task_set', newTaskSetList)
    }

    updatedSetTasks = async (oldSetId:string, newSetId: string, taskId: string) => {
        let newTaskSetList = await this.store.get('task_set') ?? this.default_set_list

        newTaskSetList[oldSetId].tasks = newTaskSetList[oldSetId].tasks.filter((taskRef: taskRef) => taskRef.taskId != taskId)
        newTaskSetList[newSetId].tasks.push({ taskId: taskId, completed: false})

        await this.store.set('task_set', newTaskSetList)
    }

    updatedSet = async (oldSetId: string, newSet: setRef) => {
        let newSetList = await this.store.get('task_set') ?? this.default_set_list
        delete newSetList[oldSetId]
        newSetList[newSet.name.toLowerCase()] = {
            key: newSet.key,
            name: newSet.name,
            desc: newSet.desc,
            tasks: newSet.tasks
        }

        await this.store.set('task_set', newSetList)
    }
}