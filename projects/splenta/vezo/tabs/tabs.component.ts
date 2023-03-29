import { Component, ContentChildren, Input, OnInit, QueryList } from '@angular/core';
import { twMerge } from 'tailwind-merge';
import { TabComponent } from './tab.component';

@Component({
  selector: 'vezo-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  @Input() className: string = "";

  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  ngOnInit(): void {
    this.className = twMerge('my-5', this.className);
  }
  ngAfterContentInit() {
    this.tabsInit();
  }
  tabsInit() {
    if (this.tabs) {
      var selectedTab = this.tabs.find(t => t.selected);
      if (!selectedTab && this.tabs.length > 0) {
        this.tabs.first['selected'] = true;
      }
    }
  }

  setSelected(tab: any) {
    this.tabs.forEach(t => t.selected = false);
    tab.selected = true;
  }

}
