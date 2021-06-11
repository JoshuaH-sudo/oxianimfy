import { Database } from "./database";
import { Storage } from "@ionic/storage";
import { ISettings } from "../custom_types";
import moment from "moment";

export class App_manager {
  storeName: string = "settings";
  store: Storage;

  settings: ISettings = {
    selectedTaskGroup: "",
    lastRefreshTimeStamp: moment().startOf("day").toString(),
  };

  constructor(app_database: Database) {
    this.store = app_database.store;
    this.createConfig().then(() => {
      this.store.get(this.storeName).then((result: any) => {
        console.log(this.storeName, result);
      });
    });
  }

  createConfig = async () => {
    const keys = await this.store.keys();
    if (keys.find((key) => key == this.storeName) == undefined) {
      await this.store.set(this.storeName, this.settings);
    }
  };

  getConfig = async () => {
    return (await this.store.get(this.storeName)) ?? this.settings;
  };

  updateTimeStamp = async () => {
    let updatedSettings: ISettings =
      (await this.store.get(this.storeName)) ?? this.settings;
    updatedSettings.lastRefreshTimeStamp = moment().startOf("day").toString();
    return await this.store.set(this.storeName, updatedSettings);
  };

  setSelectedTaskGroup = async (taskSetId: string) => {
    let updatedSettings: ISettings =
      (await this.store.get(this.storeName)) ?? this.settings;
    updatedSettings.selectedTaskGroup = taskSetId;
    return await this.store.set(this.storeName, updatedSettings);
  };

  getSelectedTaskGroup = async () => {
    let updatedSettings: ISettings =
      (await this.store.get(this.storeName)) ?? this.settings;
    return updatedSettings.selectedTaskGroup;
  };

  //test code
  subtractDay = async (numOfDays: number = 1) => {
    let updatedSettings: ISettings =
      (await this.store.get(this.storeName)) ?? this.settings;
    updatedSettings.lastRefreshTimeStamp = moment(
      updatedSettings.lastRefreshTimeStamp
    )
      .startOf("day")
      .subtract("days", numOfDays)
      .toString();
    return await this.store.set(this.storeName, updatedSettings);
  };

  addDay = async (numOfDays: number = 1) => {
    let updatedSettings: ISettings =
      (await this.store.get(this.storeName)) ?? this.settings;
    updatedSettings.lastRefreshTimeStamp = moment(
      updatedSettings.lastRefreshTimeStamp
    )
      .startOf("day")
      .add("days", numOfDays)
      .toString();
    return await this.store.set(this.storeName, updatedSettings);
  };
}
