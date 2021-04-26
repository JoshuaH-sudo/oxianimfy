import { Storage } from '@ionic/storage';

const store = new Storage();

export class database {

    constructor() {
        this.createStorage();
    }

    createStorage() {
        return new Promise(async (resolve, reject) => {
            await store.create().then(() => {
                resolve(true)
            });
        })
    }

    storeItem(key: string, item: any) {
        return new Promise(async (resolve, reject) => {
            await store.set(key, item).then(() => {
                resolve(true);
            })
        })
    }

    retriveItem(key: string) {
        return new Promise(async (resolve, reject) => {
            await store.get(key).then((result) => {
                store.forEach((key, value, index) => {
                    console.log(key)
                    console.log(value)
                    console.log(index)
                })
                resolve(result)
            })
        })
    }
}