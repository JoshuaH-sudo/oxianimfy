import { Database_manager } from "../utils/database/database_manager";
import {
  IScheduleData,
  ISetData,
  ITaskData,
  setRef,
} from "../utils/custom_types";

const Joi = require("joi");

const db_manager = new Database_manager();

afterAll(() => {
  db_manager.app_storage.clear();
});

let new_task: ITaskData = {
  name: "newTask",
  desc: "this is a test task",
  daysOfWeek: ["monday"],
  measure: "none",
  unit: "none",
};

const testSet: any = {
  name: "new-set",
  desc: "lol what a cool set",
};

describe("Testing Task functions", () => {
  let edit_task: any = {};

  const schema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().valid(Joi.ref("$task.name")).required(),
    desc: Joi.string().valid(Joi.ref("$task.desc")).required(),
    daysOfWeek: Joi.array().items(Joi.string()).required(),
    measure: Joi.string().valid(Joi.ref("$task.measure")).required(),
    unit: Joi.any().valid(Joi.ref("$task.unit")),
  });

  test("add task", async () => {
    await db_manager.addTaskToDB(new_task, "misc");
    const result = await db_manager.getTasksFromDB();

    const foundTask = result.find(
      (task: ITaskData) => task.name === new_task.name
    );

    const { error } = schema.validate(foundTask, {
      context: { task: new_task },
    });

    expect(foundTask && !error).toBeTruthy();
  });

  test("get task", async () => {
    const new_result = await db_manager.getTasksFromDB();
    edit_task = new_result.find(
      (task: ITaskData) => task.name === new_task.name
    );

    const { error } = schema.validate(edit_task, {
      context: { task: new_task },
    });

    expect(!error).toBeTruthy();
  });

  test("edit Task", async () => {
    edit_task.desc = "lol its been edit";
    await db_manager.updateTaskInDB(edit_task, "misc", "misc");

    const result = await db_manager.getTasksFromDB();
    const foundTask = result.find(
      (task: ITaskData) => task.id === edit_task.id
    );

    const { error } = schema.validate(foundTask, {
      context: {
        task: edit_task,
      },
    });

    expect(edit_task.id && !error).toBeTruthy();
  });

  test("delete task", async () => {
    await db_manager.removeTask(edit_task.id);
    const result = await db_manager.getTasksFromDB();

    const foundTask = result.find(
      (task: ITaskData) => task.id === edit_task.id
    );

    expect(foundTask).toBeUndefined();
  });

  test("delete multi tasks", async () => {
    await db_manager.addTaskToDB(new_task, "misc");
    await db_manager.addTaskToDB(new_task, "misc");
    await db_manager.addTaskToDB(new_task, "misc");

    let result = await db_manager.getTasksFromDB();
    let taskIds: any = [];
    taskIds = result.map((task: ITaskData) => {
      return task.id;
    });
    await db_manager.removeMultiTask(taskIds);

    let newResult = await db_manager.getTasksFromDB();
    expect(newResult).toStrictEqual([]);
  });
});

describe("Testing Set functions", () => {
  let testEditSet: any;

  const set_schema = Joi.object({
    name: Joi.string().required(),
    key: Joi.string().required(),
    desc: Joi.string().required(),
    tasks: Joi.array().required(),
  }).required();

  test("Add set", async () => {
    await db_manager.addTaskGroupToDB(testSet.name, testSet.desc);
    const sets = await db_manager.getSetsFromDB();
    const checkSet =
      Object.keys(sets).find((set: string) => set === "new-set") ?? "";

    testEditSet = sets[checkSet];
    const { error } = set_schema.validate(sets[checkSet]);
    expect(error).toBeUndefined();
  });

  test("Edit set", async () => {
    testEditSet.name = "edit-set";
    await db_manager.updateTaskSetInDB(testEditSet);
    const sets = await db_manager.getSetsFromDB();
    const checkSet = Object.keys(sets).find(
      (set: string) => set === testEditSet.name
    );
    expect(checkSet).toBeDefined();
  });

  test("Delete set", async () => {
    await db_manager.removeSet("edit-set");
    const sets = await db_manager.getSetsFromDB();
    const checkSet = Object.keys(sets).find(
      (set: string) => sets[set] === testSet.name
    );
    expect(checkSet).toBeUndefined();
  });

  test("Delete multi set", async () => {
    await db_manager.addTaskGroupToDB("set-lol", "delete me");
    await db_manager.addTaskGroupToDB("set-yeet", "delete me");

    let result = await db_manager.getSetsFromDB();
    await db_manager.removeMultiSet(Object.keys(result));

    let newResult = await db_manager.getSetsFromDB();
    expect(Object.keys(newResult)).toStrictEqual(["misc"]);
  });
});
