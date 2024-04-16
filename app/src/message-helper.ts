import { app, nativeTheme } from 'electron';
import * as log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { win } from 'main';

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

    static async closeApp(data:any){
        app.quit();
    }

    static async minimizeApp(data:any){
        app.hide();
    }

    static async maximizeApp(data:any){
        app.show();
        // set app to full screen size electron
        const mainWindow = win;
        if (mainWindow) {
            mainWindow.maximize();
        }
    }

    static async resize(data:any){
        app.show();
        // get previous size electron
        const mainWindow = win;
        if (mainWindow) {
            mainWindow.restore();
        }
    }
}