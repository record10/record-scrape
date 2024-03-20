import { app, BrowserWindow, ipcMain } from 'electron';
import * as isDev from 'electron-is-dev';
import * as log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';
import * as url from 'url';
import { MessageHelper } from './message-helper';

let win: BrowserWindow;
let windows = {};

async function createWindow() {
    win = new BrowserWindow({
        width: 1920, height: 1080, frame:false , webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
            devTools: true,
        }
    });

    let indexUrl = url.format({
        pathname: path.join(__dirname.replace('dist-app', ''), `dist-web`, `index.html`),
        protocol: 'file:',
        slashes: true,
    });

    if (isDev) {
        indexUrl = "http://localhost:4200";
        win.webContents.openDevTools();
    } else {
        autoUpdater.checkForUpdates();
        win.setMenu(null)
    }

    win.maximize()
    win.loadURL(indexUrl);

    win.on('closed', () => {
        //@ts-ignore
        win = null;
    })
}

ipcMain.handle('create-window', (event, tabId) => {
    let win = new BrowserWindow({ /* your options */ });
    win.loadURL("https://www.google.com/");
    windows[tabId] = win;
    return win.webContents.id;
});

ipcMain.handle('close-window', (event, tabId) => {
    if (windows[tabId]) {
        windows[tabId].close();
        delete windows[tabId];
    }
});

app.on('ready', createWindow)

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})



ipcMain.on('sync-message', MessageHelper.onMessage.bind(MessageHelper));



// Auto Updater
if (!isDev) {
    autoUpdater.on('checking-for-update', () => {
        log.info("checking-for-update");
        win.webContents.send('autoUpdateMessage', { message: "Checking for update...", updateAvailable: false });
    });

    autoUpdater.on('update-available', (info) => {
        log.info("update-available");
        win.webContents.send('autoUpdateMessage', { message: "⚡ Trying to update... " + app.getVersion(), updateAvailable: false });
    });

    autoUpdater.on('update-not-available', (info) => {
        log.info("update-not-available");
        win.webContents.send('autoUpdateMessage', { message: "You are on latest " + app.getVersion(), updateAvailable: false });
    });

    autoUpdater.on('error', (err) => {
        log.info("update-error", err);
        win.webContents.send('autoUpdateMessage', { message: "Failed to update..." + app.getVersion(), updateAvailable: false });
    });

    autoUpdater.on('download-progress', (progressObj) => {
        log.info("download-progress");
        let log_message = 'Downloaded ' + Math.round(progressObj.percent * 100) / 100 + '%';
        log.info(log_message);
        win.webContents.send('autoUpdateMessage', { message: log_message, updateAvailable: false });
    });

    autoUpdater.on('update-downloaded', (info) => {
        log.info("update-downloaded");
        win.webContents.send('autoUpdateMessage', { message: "Update is installed Restart ? ", updateAvailable: true });
    });


    setInterval(() => { autoUpdater.checkForUpdates() }, 2000 * 30);
}


ipcMain.on('installUpdate', async (event, arg) => {
    log.info("installUpdate")
    event.returnValue = true;
    autoUpdater.quitAndInstall();
})