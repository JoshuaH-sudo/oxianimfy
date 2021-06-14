import { streakData } from "../custom_types";
import { Database } from "./database";
import { Storage } from "@ionic/storage";

export class Stats_database {
  defaultStatsDB = {
    tasks: {},
    sets: {},
    app: {
      tasks_done: 0,
      sets_done: 0,
    },
  };
  store: Storage;
  storeName = "stats";

  constructor(app_database: Database) {
    this.store = app_database.store;
    this.creatStatsDB().then(() => {
      this.store.get(this.storeName).then((result: any) => {
        console.log(this.storeName, result);
      });
    });
  }

  creatStatsDB = async () => {
    const keys = await this.store.keys();
    if (keys.find((key) => key == this.storeName) == undefined) {
      await this.store.set(this.storeName, this.defaultStatsDB);
    }
  };

  getStatsDB = async () => {
    return (await this.store.get(this.storeName)) ?? this.defaultStatsDB;
  };

  getTaskStats = async () => {
    let statsDB = (await this.store.get(this.storeName)) ?? this.defaultStatsDB;
    return statsDB.tasks;
  };

  getSetStats = async () => {
    let statsDB = (await this.store.get(this.storeName)) ?? this.defaultStatsDB;
    return statsDB.sets;
  };

  incrementTaskStreak = async (taskId: string) => {
    let statsDB = await this.store.get(this.storeName);

    if (statsDB.tasks[taskId]) {
      statsDB.tasks[taskId].streak++;
    } else {
      statsDB.tasks[taskId] = { streak: 1 };
    }

    statsDB.app.tasks_done++;

    return await this.store.set(this.storeName, statsDB);
  };

  resetTaskStreak = async (taskId: string) => {
    let statsDB = await this.store.get(this.storeName);

    if (statsDB.tasks[taskId]) {
      delete statsDB.tasks[taskId];
    }

    return await this.store.set(this.storeName, statsDB);
  };

  incrementSetStreak = async (setId: string) => {
    let statsDB = await this.store.get(this.storeName);

    if (statsDB.sets[setId]) {
      statsDB.sets[setId].streak++;
    } else {
      statsDB.sets[setId] = { streak: 1 };
    }
    statsDB.app.sets_done++;

    return await this.store.set(this.storeName, statsDB);
  };

  decreseSetStreak = async (setId: string) => {
    let statsDB = await this.store.get(this.storeName);

    if (statsDB.sets[setId]) {
      statsDB.sets[setId].streak--;
    }

    return await this.store.set(this.storeName, statsDB);
  };

  resetSetStreak = async (setId: string) => {
    let statsDB = await this.store.get(this.storeName);
    console.log('set exsistis?', statsDB.sets[setId])

    if (statsDB.sets[setId]) {
      console.log('reseting set', setId)
      delete statsDB.sets[setId];
      return await this.store.set(this.storeName, statsDB);
    } else {
      return Promise.resolve();
    }
  };
  
  changeName = async (oldSetName: string, newSetName: string) => {
    let statsDB = await this.store.get(this.storeName);
    const oldData = statsDB.sets[oldSetName];
    if (oldData) {
      statsDB.sets[newSetName] = oldData;
      delete statsDB.sets[oldSetName];
      return await this.store.set(this.storeName, statsDB);
    } else {
      return Promise.resolve();
    }
  };
}
