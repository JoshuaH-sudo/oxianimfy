import { Storage } from '@ionic/storage';

const store = new Storage();

export class database {

    constructor() {
        this.createStorage();
    }

    async createStorage() {
        await store.create()
    }

    async storeItem(key: string, item: any) {
        await store.set(key, item)
    }

    async retriveItem(key: string) {
        await store.get(key)
    }

    async deleteStorage() {
        await store.clear()
    }

    async enumerateStorage() {
        await store.forEach((key, value, index) => {
            console.log(key, value, index)
        })
    }
}