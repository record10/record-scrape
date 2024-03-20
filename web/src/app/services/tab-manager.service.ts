// web/src/services/tab.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class TabService {
  tabs: { name: string, uuid: string, searchQuery: string, url: string }[] = [];
  maxHistoryLength = 10; // Set this to whatever you want
  private _tabs = new BehaviorSubject<{ name: string, uuid: string, searchQuery: string, url: string }[]>([]);
  tabs$ = this._tabs.asObservable();

  private _activeTabHistory = new BehaviorSubject<string[]>([]);
  activeTabHistory$ = this._activeTabHistory.asObservable();


  constructor() {
    const savedTabs = JSON.parse(localStorage.getItem('tabs') || '[]');
    this._tabs.next(savedTabs);
    this._activeTabHistory.next(JSON.parse(localStorage.getItem('activeTabHistory') || '[]'));
  }

  addNewTab() {
    let uuid = crypto.randomUUID();
    this.tabs.push({ name: 'New Tab', uuid: uuid, searchQuery: "", url: 'https://www.google.com' });
    this._tabs.next(this.tabs);
    
    // capp _activeTabHistory to maxHistoryLength
    if (this._activeTabHistory.value.length > this.maxHistoryLength) {
      this._activeTabHistory.next(this._activeTabHistory.value.slice(1));
    }
    this._activeTabHistory.next([...this._activeTabHistory.value, uuid]);
    
    localStorage.setItem('tabs', JSON.stringify(this.tabs));
    localStorage.setItem('activeTabHistory', JSON.stringify(this._activeTabHistory.value));
    return uuid;
  }

  closeTab(uuid: string) {
    this.tabs = this.tabs.filter(tab => tab.uuid !== uuid);
    this._tabs.next(this.tabs);
    this._activeTabHistory.next(this._activeTabHistory.value.filter(id => id !== uuid));
    localStorage.setItem('tabs', JSON.stringify(this.tabs));
  }
}