"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const isDev = require("electron-is-dev");
const log = require("electron-log");
const electron_updater_1 = require("electron-updater");
const path = require("path");
const url = require("url");
const message_helper_1 = require("./message-helper");
let win;
function createWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        win = new electron_1.BrowserWindow({
            width: 1920, height: 1080, webPreferences: {
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
        }
        else {
            electron_updater_1.autoUpdater.checkForUpdates();
            win.setMenu(null);
        }
        win.maximize();
        win.loadURL(indexUrl);
        win.on('closed', () => {
            //@ts-ignore
            win = null;
        });
    });
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
electron_1.ipcMain.on('sync-message', message_helper_1.MessageHelper.onMessage.bind(message_helper_1.MessageHelper));
// Auto Updater
if (!isDev) {
    electron_updater_1.autoUpdater.on('checking-for-update', () => {
        log.info("checking-for-update");
        win.webContents.send('autoUpdateMessage', { message: "Checking for update...", updateAvailable: false });
    });
    electron_updater_1.autoUpdater.on('update-available', (info) => {
        log.info("update-available");
        win.webContents.send('autoUpdateMessage', { message: "⚡ Trying to update... " + electron_1.app.getVersion(), updateAvailable: false });
    });
    electron_updater_1.autoUpdater.on('update-not-available', (info) => {
        log.info("update-not-available");
        win.webContents.send('autoUpdateMessage', { message: "You are on latest " + electron_1.app.getVersion(), updateAvailable: false });
    });
    electron_updater_1.autoUpdater.on('error', (err) => {
        log.info("update-error", err);
        win.webContents.send('autoUpdateMessage', { message: "Failed to update..." + electron_1.app.getVersion(), updateAvailable: false });
    });
    electron_updater_1.autoUpdater.on('download-progress', (progressObj) => {
        log.info("download-progress");
        let log_message = 'Downloaded ' + Math.round(progressObj.percent * 100) / 100 + '%';
        log.info(log_message);
        win.webContents.send('autoUpdateMessage', { message: log_message, updateAvailable: false });
    });
    electron_updater_1.autoUpdater.on('update-downloaded', (info) => {
        log.info("update-downloaded");
        win.webContents.send('autoUpdateMessage', { message: "Update is installed Restart ? ", updateAvailable: true });
    });
    setInterval(() => { electron_updater_1.autoUpdater.checkForUpdates(); }, 2000 * 30);
}
electron_1.ipcMain.on('installUpdate', (event, arg) => __awaiter(void 0, void 0, void 0, function* () {
    log.info("installUpdate");
    event.returnValue = true;
    electron_updater_1.autoUpdater.quitAndInstall();
}));
//# sourceMappingURL=main.js.map