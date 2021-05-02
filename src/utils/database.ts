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
            }).catch((err: Error) => {
                reject(err)
            })
        })
    }

    storeItem(key: string, item: any) {
        return new Promise(async (resolve, reject) => {
            await store.set(key, item).then(() => {
                resolve(true);
            }).catch((err: Error) => {
                reject(err)
            })
        })
    }

    retriveItem(key: string) {
        return new Promise(async (resolve, reject) => {
            await store.get(key).then((result) => {
                resolve(result)
            }).catch((err: Error) => {
                reject(err)
            })
        })
    }

    deleteStorage() {
        return new Promise(async (resolve, reject) => {
            await store.clear().then(() => {
                resolve(true)
            }).catch((err: Error) => {
                reject(err)
            })
        })
    }

    enumerateStorage() {
        return new Promise(async (resolve, reject) => {
            await store.forEach((key, value, index) => {
                console.log(key, value, index)
            }).catch((err: Error) => {
                reject(err)
            })
        })
    }
}