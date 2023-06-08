import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  menuItems: any[] = [
    {
      label: 'Builder',
      items: [
        { label: 'Microservices', icon: 'clipboard', routerLink: ['/builder/microservices'] },
        { label: 'Datasources', icon: 'clipboard', routerLink: ['/builder/datasources'] },
        { label: 'Collection', icon: 'clipboard', routerLink: ['/builder/collections'] },
        // { label: 'Projects', icon: 'clipboard', routerLink: ['/builder/projects'] },
        // { label: 'Modules', icon: 'clipboard', routerLink: ['/builder/modules'] },
        // { label: 'Collections', icon: 'clipboard', routerLink: ['/builder/collections'] },
        { label: 'Screens', icon: 'clipboard', routerLink: ['/builder/screens'] },
        // { label: 'Widgets', icon: 'clipboard', routerLink: ['/builder/widgets'] },
        // { label: 'Process', icon: 'clipboard', routerLink: ['/builder/processes'] },
        // { label: 'BPM', icon: 'clipboard', routerLink: ['/builder/flow'] },
        { label: 'Process', icon: 'clipboard', routerLink: ['/builder/processes'] },
        { label: 'Service', icon: 'clipboard', routerLink: ['/builder/workflows'] },
        { label: 'Releases', icon: 'clipboard', routerLink: ['/releases'] },
        { label: 'Integrations', icon: 'clipboard', routerLink: ['/marketplace'] },
      ],
      showSubMenu: true
    },
    {
      label: 'Admin',
      items: [
        { label: 'ACL', icon: 'clipboard', routerLink: ['/acl'] },
        { label: 'Settings', icon: 'clipboard', routerLink: ['/settings'] }
      ],
      showSubMenu: true
    }
  ];
}
