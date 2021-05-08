import { Task_database } from './task_database'
import { Schedule_database } from './schedule_database'
import { Database } from './database'
export class Database_manager {

    constructor() {
        const app_db = new Database()
        const task_db = new Task_database(app_db)
        const schedule_db = new Schedule_database(app_db)
    }
}