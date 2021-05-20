import { ITaskData, ISetData, taskRef } from '../custom_types';
import { Database } from './database';
import { v4 } from 'uuid'
import { Storage } from '@ionic/storage';
export class Task_database {
    default_set_list: ISetData = {
        misc: {
            desc: "The default task set",
            tasks:[]
        }
    }
    
    store: Storage;

    constructor(app_database: Database) {
        this.store = app_database.store
        this.initTaskSets()
    }

    getTasks = async () => {
        return await this.store.get('task_set') ?? [];
    }

    initTaskSets = async () => {
        let keys = await this.store.keys()
        if (keys.find(key => key == 'task_set')) {
            await this.store.set('task_set', this.default_set_list)
        }
    }

    createSet = async (setId: string, description: string) => {
        let newSetList = await this.getSets()
        newSetList[setId] = {
            desc: description,
            task:[]
        }
        await this.store.set('task_set', newSetList)
    }

    getSets = async () => {
        return await this.store.get('task_set') ?? this.default_set_list
    }

    getSetWithId = async (setId: string) => {
        let setList = await this.getSets()
        return setList[setId]
    }

    getSetsTaskIds = async (setId: string) => {
        let setList = await this.getSets()
        return setList[setId].tasks
    }

    completeTaskInSet = async (completeTaskId: string, setId: string) => {
        let taskSetList: ISetData = await this.getTasks()
        const taskIndex = taskSetList[setId].tasks.findIndex((task: taskRef) => task.taskId == completeTaskId )
        taskSetList[setId].tasks[taskIndex].completed = true
        return await this.store.set('task_set', taskSetList)
    }

    findTask = async (taskId: string) => {
        let taskList:ITaskData[] = await this.store.get('task');
        return taskList.find((task: ITaskData) => task.id == taskId)
    }

    addTask = async (newTask: ITaskData, setId: string) => {

        let newTaskList: ISetData = await this.store.get('task') ?? []
        let newTaskSetList: ISetData = await this.getSets()

        newTask.id = v4();
        newTaskList.push(newTask)
        newTaskSetList[setId].tasks.push({ taskId: newTask.id, completed: false})

        console.log('newTaskSet', newTaskSetList)

        await this.store.set('task', newTaskList)
        return await this.store.set('task_set', newTaskSetList)

    }
}
