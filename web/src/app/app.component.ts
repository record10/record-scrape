import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, NO_ERRORS_SCHEMA, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IpcRenderer } from 'electron';
import { FormsModule } from '@angular/forms';
import { TabService } from './services/tab-manager.service';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  imports: [CommonModule, RouterOutlet, FormsModule],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'web';
  tabs: { name: string, uuid: string, searchQuery: string,  url:string  }[] = [];
  @ViewChildren('webview') webviews!: QueryList<ElementRef>;

  activeTabHistory: string[] = [];
  activeTabUUID! : string ;
  ipc!: IpcRenderer;

  constructor(private tabService: TabService) {
    this.tabService.tabs$.subscribe(tabs => {
      this.tabs = tabs;
    });
    this.addNewTab();
  }

  async addNewTab() {
    this.activeTabUUID = this.tabService.addNewTab();
    this.activeTabHistory.push(this.activeTabUUID);
  }

  closeTab(uuid: string) {
    this.tabService.closeTab(uuid);
  }

  setActiveTab(uuid: string) {
    this.activeTabUUID = uuid;
    this.activeTabHistory.push(uuid);
  }

  goBack(uuid: string) {
    let tabIndex = this.tabs.findIndex(tab => tab.uuid == uuid);
    let webview = this.webviews.toArray()[tabIndex];
    if (webview) {
      (webview.nativeElement as any).goBack();
    }
  }

  goForward(uuid: string) {
    let tabIndex = this.tabs.findIndex(tab => tab.uuid == uuid);
    let webview = this.webviews.toArray()[tabIndex];
    if (webview) {
      (webview.nativeElement as any).goForward();
    }
  }

  reload(uuid: string) {
    let tabIndex = this.tabs.findIndex(tab => tab.uuid == uuid);
    let webview = this.webviews.toArray()[tabIndex];
    if (webview) {
      (webview.nativeElement as any).reload();
    }
  }

  stop(uuid: string) {
    let tabIndex = this.tabs.findIndex(tab => tab.uuid == uuid);
    let webview = this.webviews.toArray()[tabIndex];
    if (webview) {
      (webview.nativeElement as any).stop();
    }
  }

  searchGoogle(searchQuery: string, uuid: string) {
    let tabIndex = this.tabs.findIndex(tab => tab.uuid == uuid);
    let webview = this.webviews.toArray()[tabIndex];
    if (webview) {
      let googleFriendlyQuery = searchQuery.split(" ").join("+");
      (webview.nativeElement as any).loadURL(`https://www.google.com/search?q=${googleFriendlyQuery}`);
    }
  }

  // open setting for webview to inject scripts
  async openSettings(uuid: string) {
    let tabIndex = this.tabs.findIndex(tab => tab.uuid == uuid);
    let webview = this.webviews.toArray()[tabIndex];
    if (webview) {
      let res = await (webview.nativeElement as any).executeJavaScript(script.toString() + "script();" );
      console.log(res);
    }
  }

}

export function script(){
  const scrape = (xpath:string) => {
    let result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
    let nodes = [];
    let node = result.iterateNext();
    while (node) {
      nodes.push(node);
      node = result.iterateNext();
    }
    return nodes;
  };

  let result = {};

  const getInnerHtml = (xpath:string) => {
    // $x()[0] equivalent code
    let node = document.evaluate(xpath, document, null, 9, null);
    return (node?.singleNodeValue as Element)?.innerHTML;
  }

  //  if we are on linkedin profile page
  if(window.location.href.includes("linkedin.com/in/")){
    result = {
      name: getInnerHtml('//*[@id="ember40"]/h1'),
    }
  }
  return result;
}
