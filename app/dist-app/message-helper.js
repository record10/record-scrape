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
exports.MessageHelper = void 0;
const electron_1 = require("electron");
const log = require("electron-log");
const electron_updater_1 = require("electron-updater");
class MessageHelper {
    static onMessage(event, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this[arg.message](arg.data);
                event.reply('sync-reply', { message: arg.message, data: res });
            }
            catch (error) {
                event.reply('sync-reply', { message: arg.message, data: error });
            }
        });
    }
    static getVersion(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return electron_1.app.getVersion();
        });
    }
    static getLogs(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return log.transports.file.readAllLogs().reverse();
        });
    }
    static installUpdate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            electron_updater_1.autoUpdater.quitAndInstall();
            return true;
        });
    }
    static checkForUpdates(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return electron_updater_1.autoUpdater.checkForUpdates();
        });
    }
}
exports.MessageHelper = MessageHelper;
//# sourceMappingURL=message-helper.js.map