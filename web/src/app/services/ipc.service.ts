import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  ipc!: IpcRenderer;

  constructor() { 
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }
  }

  on(channel: string, listener: any) {
    if (!this.ipc) {
      return;
    }
    this.ipc.on(channel, listener);
  }

  send(channel: string, ...args: any[]) {
    if (!this.ipc) {
      return;
    }
    this.ipc.send(channel, ...args);
  }

  sendSync(fn: string, params?:any) {
    if (!this.ipc) {
      return;
    }
    return this.ipc.sendSync("sync-message", fn);
  }
}
