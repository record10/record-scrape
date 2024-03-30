// web/src/services/tab.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IpcService } from './ipc.service';


export type Tab = {
  name: string;
  uuid: string;
  searchQuery: string;
  url: string;
};

@Injectable({
  providedIn: 'root'
})
export class TabService {
  tabs: Tab[] = [];
  maxHistoryLength = 10; // Set this to whatever you want
  private tabSub = new BehaviorSubject<{ name: string, uuid: string, searchQuery: string, url: string }[]>([]);
  tabObs = this.tabSub.asObservable();

  private activeTabHistorySub = new BehaviorSubject<string[]>([]);
  activeTabHistoryObs = this.activeTabHistorySub.asObservable();


  constructor(private ipc: IpcService) {
    const savedTabs = JSON.parse(localStorage.getItem('tabs') || '[]');
    this.tabSub.next(savedTabs);
    this.activeTabHistorySub.next(JSON.parse(localStorage.getItem('activeTabHistory') || '[]'));
  }

  addNewTab() {
    let uuid = crypto.randomUUID();
    this.tabs.push({ name: 'New Tab', uuid: uuid, searchQuery: "", url: 'https://www.google.com'});
    this.tabSub.next(this.tabs);
    
    // capp _activeTabHistory to maxHistoryLength
    if (this.activeTabHistorySub.value.length > this.maxHistoryLength) {
      this.activeTabHistorySub.next(this.activeTabHistorySub.value.slice(1));
    }
    this.activeTabHistorySub.next([...this.activeTabHistorySub.value, uuid]);
    
    localStorage.setItem('tabs', JSON.stringify(this.tabs));
    localStorage.setItem('activeTabHistory', JSON.stringify(this.activeTabHistorySub.value));
    return uuid;
  }

  closeTab(uuid: string) {
    this.tabs = this.tabs.filter(tab => tab.uuid !== uuid);
    this.tabSub.next(this.tabs);
    this.activeTabHistorySub.next(this.activeTabHistorySub.value.filter(id => id !== uuid));
    localStorage.setItem('tabs', JSON.stringify(this.tabs));
    // return last tab from history
    return this.activeTabHistorySub.value[this.activeTabHistorySub.value.length - 1];
  }

  async closeApp() {
    let res = await this.ipc.sendSync('closeApp');
  }

  async minimizeApp() {
    let res = await this.ipc.sendSync('minimizeApp');
  }

  async maximizeApp() {
    let res = await this.ipc.sendSync('maximizeApp');
  }
}