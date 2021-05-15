import { Storage } from '@ionic/storage';
export class Database {
    task_list: any[] = []
    store:Storage = new Storage();

    constructor() {
        this.createStorage()
        this.deleteStorage()
    }

    async deleteStorage() {
        await this.store.clear();
    }

    async createStorage() {
        await this.store.create()
    }
}
