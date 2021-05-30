import { ITaskData, ISetData, taskRef } from '../custom_types';
import { Database } from './database';
import { v4 } from 'uuid'
import { Storage } from '@ionic/storage';
export class Task_database {
    store: Storage;

    constructor(app_database: Database) {
        this.store = app_database.store
        this.store.get('task').then((result: any) => {
            console.log('task', result)
        })
    }

    getTasks = async () => {
        return await this.store.get('task') ?? [];
    }
    
    completeTaskInSet = async (completeTaskId: string, setId: string) => {
        let taskSetList: ISetData = await this.store.get('task_set') ?? [];
        const taskIndex = taskSetList[setId].tasks.findIndex((task: taskRef) => task.taskId == completeTaskId )
        if (taskIndex >= 0) taskSetList[setId].tasks[taskIndex].completed = true
        return await this.store.set('task_set', taskSetList)
    }

    findTask = async (taskId: string) => {
        let taskList:ITaskData[] = await this.store.get('task') ?? [];
        return taskList.find((task: ITaskData) => task.id == taskId)
    }

    addTask = async (newTask: ITaskData) => {

        let newTaskList: ISetData = await this.store.get('task') ?? [];

        newTask.id = v4();
        newTaskList.push(newTask)

        return await this.store.set('task', newTaskList)

    }

    deleteTask = async (deleteTaskId: string) => {
        let taskList: ITaskData[] = await this.store.get('task') ?? [];
        taskList = taskList.filter((task: ITaskData) => task.id != deleteTaskId)

        return await this.store.set('task', taskList)
    }

    editTask = async (updateTask: ITaskData) => {
        let newTaskList: ISetData = await this.store.get('task') ?? [];

        let index = newTaskList.findIndex((task: ITaskData) => task.id == updateTask.id)
        console.log(index)
        if (index != -1) newTaskList[index] = updateTask
        
        return await this.store.set('task', newTaskList)

    }
}
