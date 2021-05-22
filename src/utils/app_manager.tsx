import { Database } from './database/database';
import { Storage } from '@ionic/storage';
import { ISettings } from './custom_types';

export class App_manager {
    storeName: string = 'settings'
    store: Storage;
    settings: ISettings = {
        selectedTaskGroup: ''
    }

    constructor(app_database: Database) {
        this.store = app_database.store
    }

    getConfig = async () => {
        return await this.store.get(this.storeName) ?? this.settings;
    }

    setSelectedTaskGroup = async (taskSetId: string) => {
        let settings: ISettings = await this.store.get(this.storeName) ?? this.settings;
        settings.selectedTaskGroup = taskSetId
        return await this.store.set(this.storeName, settings)
    }

    getSelectedTaskGroup = async () => {
        let settings: ISettings = await this.store.get(this.storeName) ?? this.settings;
        return settings.selectedTaskGroup
    }
}
