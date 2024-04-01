import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tab, TabService } from '../../services/tab-manager.service';
import { SettingComponent } from '../setting/setting.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements AfterViewInit {
  title = 'web';
  tabs: Tab[] = [];
  @ViewChildren('webview') webviews!: QueryList<ElementRef>;

  activeTabHistory: string[] = [];
  activeTabUUID! : string ;
 

  constructor(private tabService: TabService, public dialog: MatDialog) {
    this.tabService.tabObs.subscribe(tabs => {
      this.tabs = tabs;
    });

    this.tabService.activeTabHistoryObs.subscribe(history => {
      this.activeTabHistory = history;
    });
    this.addNewTab();
  }


  ngAfterViewInit() {
    this.webviews.changes.subscribe(() => {
      this.webviews.toArray().forEach((webview, index) => {
        // Get the corresponding tab
        const tab = this.tabs[index];
  
        // Add listeners to the webview
        webview.nativeElement.addEventListener('dom-ready', () => {
          console.log(`DOM is ready for tab ${tab.uuid}`);
        });
  
        webview.nativeElement.addEventListener('did-navigate', (e) => {
          console.log(`Did navigate to ${e.url} for tab ${tab.uuid}`);
        });
  
        // Add more listeners as needed...
      });
    });
  }

  closeApp = this.tabService.closeApp;
  minimizeApp = this.tabService.minimizeApp;
  maximizeApp = this.tabService.maximizeApp;

  async addNewTab() {
    this.activeTabUUID = this.tabService.addNewTab();
    this.activeTabHistory.push(this.activeTabUUID);
  }

  closeTab(uuid: string) {
    this.activeTabUUID = this.tabService.closeTab(uuid);
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

      // check if searchQuery is not of url pattern
      let isUrl = searchQuery.match(/^(http|https):\/\/[^ "]+$/);
      if(isUrl){
        (webview.nativeElement as any).loadURL(searchQuery);
        return;
      }
      // replace spaces with + for google search
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

  openSetting(){
    this.dialog.open(SettingComponent, {
      width: '80vw'
    });
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
      name: getInnerHtml("//h1[contains(@class, 'text-heading-xlarge') and contains(@class, 'inline') and contains(@class, 't-24') and contains(@class, 'v-align-middle') and contains(@class, 'break-words')]"),
    }
  }
  return result;
}

