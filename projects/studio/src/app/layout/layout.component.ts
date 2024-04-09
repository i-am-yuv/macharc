import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ProjectService } from '../project/project.service';
import { FilterBuilder } from '../utils/FilterBuilder';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  showSideBar = true;
  activeProject = { projectName: 'SELECT PROJECT' };
  menuItems: any[] = [
    {
      label: 'Application',
      items: [
        { label: 'Projects', icon: 'clipboard', routerLink: ['/projects'] },
      ]
    },
    {
      label: 'Backend',
      items: [

        { label: 'Datasources', icon: 'clipboard', routerLink: ['/builder/datasources'] },
        { label: 'Microservices', icon: 'clipboard', routerLink: ['/builder/microservices'] },
        { label: 'Collections', icon: 'clipboard', routerLink: ['/builder/collections'] },
        { label: 'Services', icon: 'clipboard', routerLink: ['/builder/services'] },
      ],
      showSubMenu: true
    },
    {
      label: 'Frontend',
      items: [
        // { label: 'Applications', icon: 'clipboard', routerLink: ['/applications'] },
        { label: 'Forms', icon: 'clipboard', routerLink: ['/builder/forms'] },
        { label: 'Screens', icon: 'clipboard', routerLink: ['/builder/screens'] },
        { label: 'Actions', icon: 'clipboard', routerLink: ['/actions'] },
        { label: 'Mobile Builder', icon: 'clipboard', routerLink: [''], externalUrl: 'https://www.splenta.com' },
      ],
      showSubMenu: true
    },
    {
      label: 'Utilities',
      items: [
        { label: 'Business Process', icon: 'clipboard', routerLink: ['/builder/processes'] },
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
    private projectService: ProjectService
  ) { }
  ngOnInit() {
    this.username = this.authService.getUserName();
    this.roles = this.authService.getRoles();
    var search = FilterBuilder.boolEqual('isdefault', true);
    this.projectService.getAllData(undefined, search).then((res: any) => {
      if (res)
        this.activeProject.projectName = res.content[0].projectName;
    })

  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
