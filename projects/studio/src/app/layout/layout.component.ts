import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  showSideBar = true;
  activeProject = { projectName: 'NeoSell' };
  menuItems: any[] = [
    {
      label: 'Backend',
      items: [
        { label: 'Datasources', icon: 'clipboard', routerLink: ['/builder/datasources'] },
        { label: 'Microservices', icon: 'clipboard', routerLink: ['/builder/microservices'] },
        { label: 'Collections', icon: 'clipboard', routerLink: ['/builder/collections'] },
        { label: 'Services', icon: 'clipboard', routerLink: ['/builder/workflows'] },
      ],
      showSubMenu: true
    },
    {
      label: 'Frontend',
      items: [
        { label: 'Applications', icon: 'clipboard', routerLink: ['/builder/collections'] },
        { label: 'Forms', icon: 'clipboard', routerLink: ['/builder/forms'] },
        { label: 'Screens', icon: 'clipboard', routerLink: ['/builder/screens'] },
      ],
      showSubMenu: true
    },
    {
      label: 'Utilities',
      items: [
        { label: 'Processes', icon: 'clipboard', routerLink: ['/builder/processes'] },
        { label: 'Reports', icon: 'clipboard', routerLink: ['/builder/reports'] },
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
  roles: any;
  username: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }
  ngOnInit() {
    this.username = this.authService.getUserName();
    this.roles = this.authService.getRoles();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
