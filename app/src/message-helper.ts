import { app } from 'electron';
import * as log from 'electron-log';
import { autoUpdater } from 'electron-updater';

export class MessageHelper {

    public static async onMessage(event:any, arg:any) {
        try {
            let res = await this[arg.message](arg.data);
            event.reply('sync-reply', { message: arg.message, data: res })
        } catch (error) {
            event.reply('sync-reply', { message: arg.message, data: error })
        }
    }

    static async getVersion(data) {
        return app.getVersion();
    }

    static async getLogs(data){
        return log.transports.file.readAllLogs().reverse();
    }
    
    static async installUpdate(data){
        autoUpdater.quitAndInstall();
        return true;
    }

    static async checkForUpdates(data){
        return autoUpdater.checkForUpdates();
    }

}