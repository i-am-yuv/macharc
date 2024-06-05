import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Project } from '../project/project';
import { ProjectService } from '../project/project.service';
import { LayoutService } from './layout.service';
import { FilterBuilder } from '../utils/FilterBuilder';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  showSideBar: boolean = false;

  activeProject: Project | undefined = {
    id: '',
    projectName: 'SELECT PROJECT',
  };
  menuItems: any[] = [
    // {
    //   label: 'Application',
    //   items: [
    //     { label: 'Projects', icon: 'clipboard', routerLink: ['/projects'] },
    //     {
    //       label: 'Datasources',
    //       icon: 'clipboard',
    //       routerLink: ['/builder/datasources'],
    //     },
    //   ],
    // },
    {
      label: 'Microservice',
      items: [
        {
          label: 'Microservices',
          icon: 'clipboard',
          routerLink: ['/builder/microservices'],
        },
        {
          label: 'Models',
          icon: 'clipboard',
          routerLink: ['/builder/collections'],
        },
        {
          label: 'Services',
          icon: 'clipboard',
          routerLink: ['/builder/services'],
        },
      ],
      showSubMenu: true,
    },
    {
      label: 'Frontend',
      items: [
        {
          label: 'Applications',
          icon: 'clipboard',
          routerLink: ['/applications'],
        },
        { label: 'Pages', icon: 'clipboard', routerLink: ['/builder/screens'] },
        { label: 'Actions', icon: 'clipboard', routerLink: ['/actions'] },
        {
          label: 'Components',
          icon: 'clipboard',
          routerLink: ['/builder/forms'],
        },
        {
          label: 'Mobile Builder',
          icon: 'clipboard',
          routerLink: [''],
          externalUrl: 'https://www.splenta.com',
        },
      ],
      showSubMenu: true,
    },
    {
      label: 'Utilities',
      items: [
        {
          label: 'Business Process',
          icon: 'clipboard',
          routerLink: ['/builder/processes'],
        },
        {
          label: 'Reports',
          icon: 'clipboard',
          routerLink: ['/builder/reports'],
        },
        { label: 'Releases', icon: 'clipboard', routerLink: ['/releases'] },
        { label: 'Logs', icon: 'clipboard', routerLink: ['/system-logs'] },
        // {
        //   label: 'Integrations',
        //   icon: 'clipboard',
        //   routerLink: ['/marketplace'],
        // },
      ],
      showSubMenu: true,
    },
    // {
    //   label: 'Admin',
    //   items: [
    //     { label: 'ACL', icon: 'clipboard', routerLink: ['/acl'] },
    //     { label: 'Settings', icon: 'clipboard', routerLink: ['/settings'] },
    //   ],
    //   showSubMenu: true,
    // },
  ];
  roles: any;
  username: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private projectService: ProjectService,
    private layoutService: LayoutService
  ) {
    this.layoutService.sidebarVisibilityChange.subscribe((value) => {
      this.showSideBar = value;
    });
    
  }
  ngOnInit() {
    this.username = this.authService.getUserName();
    this.roles = this.authService.getRoles();
    var search = FilterBuilder.boolEqual('isdefault', true);
    // this.projectService.getAllData(undefined, search).then((res: any) => {
    //   if (res.content[0] != null ) this.activeProject = res.content[0];
    // });
    this.projectService.setActiveProject();
    this.projectService.getActiveProject().subscribe((val) => {
      this.activeProject = val;
    });
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  toggleSideBar() {
    this.layoutService.toggleSidebarVisibility();
  }
}
