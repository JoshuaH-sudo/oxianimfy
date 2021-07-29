import { Task_database } from "./task_database";
import { Task_set_database } from "./task_set_database";
import { Schedule_database } from "./schedule_database";
import { Database } from "./database";
import { IScheduleData, ITaskData, setRef, taskRef } from "../custom_types";
import { Storage } from "@ionic/storage";
import { App_manager } from "./app_manager";
import { Stats_database } from "./stats_database";

import moment from "moment";

export class Database_manager {
  app_db: Database;
  task_db: Task_database;
  task_set_db: Task_set_database;
  schedule_db: Schedule_database;
  stats_db: Stats_database;
  app_manager: App_manager;
  app_storage: Storage;

  constructor() {
    this.app_db = new Database();

    this.task_db = new Task_database(this.app_db);
    this.task_set_db = new Task_set_database(this.app_db);
    this.schedule_db = new Schedule_database(this.app_db);
    this.stats_db = new Stats_database(this.app_db);
    this.app_manager = new App_manager(this.app_db);

    this.app_storage = this.app_db.store;

    this.resetTaskCompletionInTaskSets().then(() => {
      this.stats_db.getStatsDB().then((result: any) => {
        console.log("streak reset", result);
      });
      this.task_set_db.getSets().then((result: any) => {
        console.log("task_set", result);
      });
    });
  }

  addTaskToDB = (newTask: ITaskData, set: string) => {
    return new Promise((resolve, reject) => {
      this.task_db
        .addTask(newTask)
        .then(async () => {
          await this.task_set_db.addTaskToSet(set, newTask.id);
          await this.recalculateStreak(set);
        })
        .then(() =>
          this.schedule_db.addSetToSchedule(set, newTask.daysOfWeek, newTask.id)
        )
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  };

  recalculateStreak = async (set: string) => {
    //if set is done for today then draw back set streak
    if (await this.isSetDoneForToday(set)) {
      this.stats_db.decreseSetStreak(set);
    }
  };

  removeTask = (task_id: string) => {
    return new Promise((resolve, reject) => {
      //remove task and in any set it belongs to
      this.task_db
        .deleteTask(task_id)
        .then(() => {
          this.task_set_db
            .findSetsBelongingToTask(task_id)
            .then((foundSetIds) => {
              let promises: any = [];
              foundSetIds.forEach((setId: string) => {
                promises.push(
                  this.schedule_db
                    .removeTaskInSchedule(setId, task_id)
                    .then(() =>
                      this.task_set_db.removeTaskFromSet(setId, task_id)
                    )
                );
                
                //If there are no more tasks left to do in set. Increment streak
                this.getTasksFromSetForToday(setId).then(
                  async (tasks: taskRef[]) => {
                    if (tasks.length === 0)
                      await this.stats_db.incrementSetStreak(setId);
                  }
                );
              });

              Promise.all(promises).then(async () => {
                resolve(true);
              });
            });
        })
        .catch((error) => reject(error));
    });
  };

  promiseForEach(arr: any, cb: Function) {
    var i: number = 0;

    var nextPromise: any = function () {
      if (i >= arr.length) {
        // Processing finished.
        return;
      }

      // Process next function. Wrap in `Promise.resolve` in case
      // the function does not return a promise
      var newPromise: any = Promise.resolve(cb(arr[i], i));
      i++;
      // Chain to finish processing.
      return newPromise.then(nextPromise);
    };

    // Kick off the chain.
    return Promise.resolve().then(nextPromise);
  }

  removeMultiTask = (taskIdArray: string[]) => {
    return this.promiseForEach(taskIdArray, this.removeTask);
  };

  removeSet = (set_name: string) => {
    return new Promise((resolve, reject) => {
      this.task_set_db
        .getSetsTaskIds(set_name)
        .then((taskIds: any) => this.task_db.deleteMultiTask(taskIds))
        .then(() => this.task_set_db.deleteSet(set_name))
        .then(() => this.schedule_db.deleteSetInSchedule(set_name))
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  };

  removeMultiSet = (setArray: string[]) => {
    return this.promiseForEach(setArray, this.removeSet);
  };

  updateTaskSetInDB = async (set: setRef) => {
    const oldSet = await this.task_set_db.getSetWithKey(set.key);
    if (oldSet) {
      await this.task_set_db.updatedSet(oldSet.name.toLowerCase(), set);
      await this.schedule_db.replaceSetInSchedule(
        oldSet.name.toLowerCase(),
        set.name.toLowerCase()
      );
      return await this.stats_db.changeName(oldSet.name, set.name);
    }
  };

  updateTaskInDB = (
    updatedTask: ITaskData,
    updatedGroup: string,
    oldGroup: string
  ) => {
    return new Promise((resolve, reject) => {
      this.task_db
        .editTask(updatedTask)
        .then(() => {
          if (updatedGroup != oldGroup)
          this.task_set_db.updatedSetTasks(
              oldGroup,
              updatedGroup,
              updatedTask.id
            );
        })
        //remove the task from the schedule entirely from previous group
        .then(() =>
          this.schedule_db.removeTaskInSchedule(oldGroup, updatedTask.id)
        )
        //re add the task back in on each day its ment to be in with the newest group
        .then(() =>
          this.schedule_db.addSetToSchedule(
            updatedGroup,
            updatedTask.daysOfWeek,
            updatedTask.id
          )
        )
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  };

  getSetsFromDB = async () => {
    return await this.task_set_db.getSets();
  };

  addTaskGroupToDB = async (setId: string, description: string) => {
    return await this.task_set_db.createSet(setId, description);
  };

  getTasksFromDB = async (): Promise<ITaskData[]> => {
    return this.task_db.getTasks();
  };

  betweenLastTimeToToday = (lastTimeStamp: moment.Moment, day: string) => {
    //sunday is considered the first day of the week
    let startOfWeek =
      moment().format("dddd") === "Sunday"
        ? moment().startOf("week").subtract(1, "week")
        : moment().startOf("week");

    //check the days that are inbetween the last time stamp and today
    return (
      lastTimeStamp.isBefore(startOfWeek.day(day), "day") ||
      (lastTimeStamp.isSame(startOfWeek.day(day), "day") &&
        startOfWeek.day(day).isBefore(moment(), "day"))
    );
  };

  resetTaskCompletionInTaskSets = async () => {
    let config = await this.app_manager.getConfig();
    let schedule = await this.schedule_db.getSchedule();

    let currentTime = moment();
    let lastTimeStamp = moment(config.lastRefreshTimeStamp);
    // let lastTimeStamp = moment().subtract(3, 'days');
    let timeDifference = moment
      .duration(lastTimeStamp.diff(currentTime))
      .as("days");
    console.log("last day", lastTimeStamp.format("dddd"));
    //if its been a day or more, refresh tasks avaliable
    console.log("should refresh? ", timeDifference <= -1);
    let promises: any[] = [];

    console.log("last timeStamp", lastTimeStamp);

    if (timeDifference <= -1) {
      Object.keys(schedule).map((day: string) => {
        Object.keys(schedule[day]).map((set: string) => {
          set = set.toLocaleLowerCase();
          if (
            !schedule[day][set].completed &&
            this.betweenLastTimeToToday(lastTimeStamp, day)
          ) {
            promises.push(this.stats_db.resetSetStreak(set));
          }
          promises.push(this.task_set_db.resetTaskCompletenss(set));
        });
      });
      promises.push(this.app_manager.updateTimeStamp());
    }

    return await Promise.all(promises);
  };

  completeTask = async (completedTasksId: string, setId: string) => {
    await this.task_db.completeTaskInSet(completedTasksId, setId);
    await this.stats_db.incrementTaskStreak(completedTasksId);
    await this.schedule_db.completeTaskInSetSchedule(completedTasksId, setId);
    if (await this.isSetDoneForToday(setId))
      return this.stats_db.incrementSetStreak(setId);
  };

  getSetsFromDBForToday = async () => {
    let schedule = await this.schedule_db.getSchedule();
    const today = this.schedule_db.getTodaysName();
    return schedule[today];
  };

  isSetNotDoneForToday = async (setId: string) => {
    let scheduleSets = await this.getSetsFromDBForToday();
    if (scheduleSets[setId.toLowerCase()]) {
      return scheduleSets[setId.toLowerCase()].completed != true;
    } else {
      return true;
    }
  };

  isSetDoneForToday = async (setId: string) => {
    let scheduleSets = await this.getSetsFromDBForToday();
    if (scheduleSets[setId.toLowerCase()]) {
      return scheduleSets[setId.toLowerCase()].completed === true;
    } else {
      return false;
    }
  };

  getSetsDetailsFromDbForToday = async () => {
    let promises: any[] = [];
    let setIdList = await this.getSetsFromDBForToday();
    Object.keys(setIdList).forEach((entry: string) => {
      promises.push(this.task_set_db.getSetWithId(entry));
    });

    return await Promise.all(promises);
  };

  getSetsDetails = async (setId: string) => {
    return await this.task_set_db.getSetWithId(setId);
  };

  getAllTaskDetails = async (taskSet: string) => {
    let promises: any[] = [];
    let taskIdList = await this.task_set_db.getSetsTaskIds(taskSet);

    taskIdList.forEach((entry: taskRef) => {
      promises.push(this.task_db.findTask(entry.taskId));
    });

    return await Promise.all(promises);
  };

  getTasksFromSetForToday = async (taskSet: string) => {
    let promises: any[] = [];
    let taskIdList = await this.task_set_db.getSetsTaskIds(taskSet);
    const today = this.schedule_db.getTodaysName();

    taskIdList.forEach((entry: taskRef) => {
      if (entry.completed === false) {
        promises.push(this.task_db.findTask(entry.taskId));
      }
    });

    let taskDetailList = await Promise.all(promises);
    return taskDetailList.filter((task: ITaskData) => {
      if (task && task.daysOfWeek.indexOf(today) > -1) return task;
    });
  };

  getUncompletedTasks = async (setTaskRefs: taskRef[], set: string) => {
    let taskList = await this.getTasksFromSetForToday(set);

    //get task details from task refs
    let taskToDoList: any = [];
    taskList.forEach((taskDetails: any) => {
      let foundTask: any = setTaskRefs
        ? setTaskRefs.find(
            (taskRefrence: taskRef) =>
              taskRefrence.taskId === taskDetails.id &&
              taskRefrence.completed === false
          )
        : [];
      if (foundTask != undefined) taskToDoList.push(foundTask);
    });

    return taskToDoList;
  };

  getSetWithTask = async (task_id: string) => {
    const sets = await this.task_set_db.getSets();
    let foundSet = "";

    Object.keys(sets).forEach((set: string) => {
      const foundTask = sets[set].tasks.find(
        (task: taskRef) => task.taskId === task_id
      );
      if (foundTask) foundSet = set;
    });
    return foundSet;
  };

  getSchedule = async () => {
    let result = await this.schedule_db.getSchedule()
    return result
  }
}
