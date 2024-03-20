import { app, nativeTheme } from 'electron';
import * as log from 'electron-log';
import { autoUpdater } from 'electron-updater';

export class MessageHelper {

    public static async onMessage(event:any, arg:any) {
        try {
            let res = await (<any>this)[arg.message](arg.data);
            event.reply('sync-reply', { message: arg.message, data: res })
        } catch (error) {
            event.reply('sync-reply', { message: arg.message, data: error })
        }
    }

    static async getVersion(data:any) {
        return app.getVersion();
    }

    static async getLogs(data:any){
        return log.transports.file.readAllLogs().reverse();
    }
    
    static async installUpdate(data:any){
        autoUpdater.quitAndInstall();
        return true;
    }

    static async checkForUpdates(data:any){
        return autoUpdater.checkForUpdates();
    }

    static async isNightMode(data:any){
        return nativeTheme.shouldUseDarkColors;
    }

}