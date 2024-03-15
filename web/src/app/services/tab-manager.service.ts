// web/src/services/tab.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class TabService {
  tabs: { name: string, uuid: string, searchQuery: string, url: string }[] = [];
  activeTabHistory: string[] = [];
  maxHistoryLength = 10; // Set this to whatever you want
  private _tabs = new BehaviorSubject<{ name: string, uuid: string, searchQuery: string, url: string }[]>([]);
  tabs$ = this._tabs.asObservable();


  constructor() {
    const savedTabs = JSON.parse(localStorage.getItem('tabs') || '[]');
    this._tabs.next(savedTabs);
    this.activeTabHistory = JSON.parse(localStorage.getItem('activeTabHistory') || '[]');
  }

  addNewTab() {
    let uuid = crypto.randomUUID();
    this.tabs.push({ name: 'New Tab', uuid: uuid, searchQuery: "", url: 'https://www.google.com' });
    this._tabs.next(this.tabs);
    this.activeTabHistory.push(uuid);
    while (this.activeTabHistory.length > this.maxHistoryLength) {
      this.activeTabHistory.shift();
    }
    localStorage.setItem('tabs', JSON.stringify(this.tabs));
    localStorage.setItem('activeTabHistory', JSON.stringify(this.activeTabHistory));
    return uuid;
  }

  closeTab(uuid: string) {
    this.tabs = this.tabs.filter(tab => tab.uuid !== uuid);
    this._tabs.next(this.tabs);
    localStorage.setItem('tabs', JSON.stringify(this.tabs));
  }
}