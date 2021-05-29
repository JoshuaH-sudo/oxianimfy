import { Task_database } from './task_database'
import { Task_set_database } from './task_set_database'
import { Schedule_database } from './schedule_database'
import { Database } from './database'
import { IScheduleData, ITaskData, setRef, taskRef } from '../custom_types';
import { Storage } from '@ionic/storage';
import { App_manager } from './app_manager';
import moment from 'moment';

export class Database_manager {
    app_db: Database
    task_db: Task_database
    task_set_db: Task_set_database
    schedule_db: Schedule_database
    app_manager: App_manager
    app_storage: Storage

    constructor() {
        this.app_db = new Database()
        this.task_db = new Task_database(this.app_db)
        this.task_set_db = new Task_set_database(this.app_db)
        this.schedule_db = new Schedule_database(this.app_db)
        this.app_manager = new App_manager(this.app_db)
        this.app_storage = this.app_db.store

        this.resetTaskCompletionInTaskSets()
        this.task_set_db.getSets().then((result: any) => {
            console.log('task_set', result)
        })
    }

    addTaskToDB = (newTask: ITaskData, set: string) => {
        return new Promise((resolve, reject) => {
            this.task_db.addTask(newTask)
                .then(() => this.task_set_db.addTaskToSet(set, newTask.id))
                .then(() => this.schedule_db.addSetToSchedule(set, newTask.daysOfWeek, newTask.id))
                .then(() => resolve(true))
                .catch(error => reject(error))
        })
    }

    updateTaskInDB = (updatedTask: ITaskData, updatedGroup: string, oldGroup: string) => {
        return new Promise((resolve, reject) => {
            this.task_db.editTask(updatedTask)
                .then(() =>  { if (updatedGroup != oldGroup) this.task_set_db.updatedSetTasks(oldGroup, updatedGroup, updatedTask.id) })
                //remove the task from the schedule entirely from previous group
                .then(() => this.schedule_db.removeTaskInSchedule(oldGroup, updatedTask.id))
                //re add the task back in on each day its ment to be in with the newest group
                .then(() => this.schedule_db.addSetToSchedule(updatedGroup, updatedTask.daysOfWeek, updatedTask.id))
                .then(() => resolve(true))
                .catch(error => reject(error))
        })
    }

    getSetsFromDb = async () => {
        return await this.task_set_db.getSets()
    }

    addTaskGroupToDB = async (setId: string, description: string) => {
        return await this.task_set_db.createSet(setId, description)
    }

    getTasksFromDB = () => {
        return new Promise((resolve, reject) => {
            this.task_db.getTasks().then((tasks: ITaskData[]) => {
                resolve(tasks)
            }).catch(error => {
                reject(error)
            })
        })
    }

    resetTaskCompletionInTaskSets = async () => {
        let config = await this.app_manager.getConfig()
        let promises: any[] = []

        let schedule = await this.schedule_db.getSchedule()

        let currentTime = moment()
        let lastTimeStamp = moment(config.lastRefreshTimeStamp)
        let timeDifference = moment.duration(lastTimeStamp.diff(currentTime)).as('days')

        //if its been a day or more, refresh tasks avaliable
        console.log('time diff', timeDifference)
        console.log('should refresh? ', timeDifference <= -1)

        if (timeDifference <= -1) {
            Object.keys(schedule).map((day: string) => {

                Object.keys(schedule[day]).map((set: string) => {
                    promises.push(
                        this.task_set_db.resetTaskCompletenss(set.toLowerCase())
                    )
                })

            })
            promises.push(
                this.app_manager.updateTimeStamp()
            )
        }

        return await Promise.all(promises)
    }

    completeTask = async (completedTasksId: string, setId: string) => {
        await this.task_db.completeTaskInSet(completedTasksId, setId)
        let currentSet = await this.task_set_db.getSetWithId(setId)
        let currentTasks = await this.getUncompletedTasks(currentSet.tasks, setId)

        if (currentTasks.length <= 0) {

            return await this.schedule_db.completeSetSchedule(setId)
        }
    }

    getSetsFromDBForToday = async () => {
        let schedule = await this.schedule_db.getSchedule()
        const today = this.schedule_db.getTodaysName()
        return schedule[today]
    }

    isSetNotDoneForToday = async (setId: string) => {
        let scheduleSets = await this.getSetsFromDBForToday()
        return scheduleSets[setId.toLowerCase()].completed != true
    }

    getSetsDetailsFromDbForToday = async () => {
        let promises: any[] = []
        let setIdList = await this.getSetsFromDBForToday()
        Object.keys(setIdList).forEach((entry: string) => {
            promises.push(
                this.task_set_db.getSetWithId(entry)
            )
        })

        return await Promise.all(promises)
    }

    getSetsDetails = async (setId: string) => {
        return await this.task_set_db.getSetWithId(setId)
    }

    getAllTaskDetails = async (taskSet: string) => {
        let promises: any[] = []
        let taskIdList = await this.task_set_db.getSetsTaskIds(taskSet)

        taskIdList.forEach((entry: taskRef) => {
            promises.push(
                this.task_db.findTask(entry.taskId)
            )
        })

        return await Promise.all(promises)
    }

    getTasksFromSetForToday = async (taskSet: string) => {

        let promises: any[] = []
        let taskIdList = await this.task_set_db.getSetsTaskIds(taskSet)
        const today = this.schedule_db.getTodaysName()

        taskIdList.forEach((entry: taskRef) => {
            if (entry.completed == false) {
                promises.push(
                    this.task_db.findTask(entry.taskId)
                )
            }
        })

        let taskDetailList = await Promise.all(promises)
        return taskDetailList.filter((task: ITaskData) => task.daysOfWeek.indexOf(today) > -1)
    }


    getUncompletedTasks = async (setTaskRefs: taskRef[], set: string) => {
        let taskList = await this.getTasksFromSetForToday(set)

        //get task details from task refs
        let taskToDoList: any = []
        taskList.forEach((taskDetails: any) => {
            let foundTask = setTaskRefs.find((taskRefrence: taskRef) => taskRefrence.taskId == taskDetails.id && taskRefrence.completed == false)
            if (foundTask != undefined) taskToDoList.push(foundTask)
        });

        return taskToDoList
    }
}