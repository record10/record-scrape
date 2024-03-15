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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var isDev = require("electron-is-dev");
var log = require("electron-log");
var electron_updater_1 = require("electron-updater");
var path = require("path");
var url = require("url");
var message_helper_1 = require("./message-helper");
var win;
var windows = {};
function createWindow() {
    return __awaiter(this, void 0, void 0, function () {
        var indexUrl;
        return __generator(this, function (_a) {
            win = new electron_1.BrowserWindow({
                width: 1920, height: 1080, webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                    webviewTag: true,
                    devTools: true,
                }
            });
            indexUrl = url.format({
                pathname: path.join(__dirname.replace('dist-app', ''), "dist-web", "index.html"),
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
            win.on('closed', function () {
                //@ts-ignore
                win = null;
            });
            return [2 /*return*/];
        });
    });
}
electron_1.ipcMain.handle('create-window', function (event, tabId) {
    var win = new electron_1.BrowserWindow({ /* your options */});
    win.loadURL("https://www.google.com/");
    windows[tabId] = win;
    return win.webContents.id;
});
electron_1.ipcMain.handle('close-window', function (event, tabId) {
    if (windows[tabId]) {
        windows[tabId].close();
        delete windows[tabId];
    }
});
electron_1.app.on('ready', createWindow);
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
electron_1.ipcMain.on('sync-message', message_helper_1.MessageHelper.onMessage.bind(message_helper_1.MessageHelper));
// Auto Updater
if (!isDev) {
    electron_updater_1.autoUpdater.on('checking-for-update', function () {
        log.info("checking-for-update");
        win.webContents.send('autoUpdateMessage', { message: "Checking for update...", updateAvailable: false });
    });
    electron_updater_1.autoUpdater.on('update-available', function (info) {
        log.info("update-available");
        win.webContents.send('autoUpdateMessage', { message: "⚡ Trying to update... " + electron_1.app.getVersion(), updateAvailable: false });
    });
    electron_updater_1.autoUpdater.on('update-not-available', function (info) {
        log.info("update-not-available");
        win.webContents.send('autoUpdateMessage', { message: "You are on latest " + electron_1.app.getVersion(), updateAvailable: false });
    });
    electron_updater_1.autoUpdater.on('error', function (err) {
        log.info("update-error", err);
        win.webContents.send('autoUpdateMessage', { message: "Failed to update..." + electron_1.app.getVersion(), updateAvailable: false });
    });
    electron_updater_1.autoUpdater.on('download-progress', function (progressObj) {
        log.info("download-progress");
        var log_message = 'Downloaded ' + Math.round(progressObj.percent * 100) / 100 + '%';
        log.info(log_message);
        win.webContents.send('autoUpdateMessage', { message: log_message, updateAvailable: false });
    });
    electron_updater_1.autoUpdater.on('update-downloaded', function (info) {
        log.info("update-downloaded");
        win.webContents.send('autoUpdateMessage', { message: "Update is installed Restart ? ", updateAvailable: true });
    });
    setInterval(function () { electron_updater_1.autoUpdater.checkForUpdates(); }, 2000 * 30);
}
electron_1.ipcMain.on('installUpdate', function (event, arg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        log.info("installUpdate");
        event.returnValue = true;
        electron_updater_1.autoUpdater.quitAndInstall();
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=main.js.map