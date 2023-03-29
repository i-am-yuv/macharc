import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { TabComponent } from './tab.component';
import { IconModule } from '@splenta/vezo/icon';

@NgModule({
  declarations: [
    TabsComponent, TabComponent
  ],
  imports: [
    CommonModule, IconModule
  ],
  exports: [
    TabsComponent, TabComponent
  ]
})
export class TabsModule { }
