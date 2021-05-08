import { Storage } from '@ionic/storage';
import { v4 } from 'uuid'
export class Database {
    task_list: any[] = []
    store:Storage = new Storage();

    constructor() {
        this.createStorage()
        this.clearStorage()
    }

    async clearStorage() {
        await this.store.clear();
    }

    async createStorage() {
        await this.store.create()
    }
}
