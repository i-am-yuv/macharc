import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Project } from '../project/project';
import { ProjectService } from '../project/project.service';
import { FilterBuilder } from '../utils/FilterBuilder';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  showSideBar: boolean | undefined = false;
  giveDefaultPadding: boolean = true;

  menuView: string = '';
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

  menuItemsBackend: any[] = [
    {
      label: 'Microservice',
      items: [
        {
          label: 'Microservices',
          icon: 'clipboard',
          routerLink: ['/builder/microservices'],
          image: 'assets/microservice_L.svg',
        },
        // ,
        // {
        //   label: 'Datasources',
        //   icon: 'clipboard',
        //   routerLink: ['/datasources'],
        //   image: 'assets/Database2.svg',
        // },
        // {
        //   label: 'Models',
        //   icon: 'clipboard',
        //   routerLink: ['/builder/collections'],
        //   image: 'assets/collection_L.svg',
        // },
        // {
        //   label: 'Services',
        //   icon: 'clipboard',
        //   routerLink: ['/builder/services'],
        //   image: 'assets/Services_L.svg',
        // }
      ],
      showSubMenu: true,
    },
  ];

  menuItemsDatasource: any[] = [
    {
      label: 'Datasource',
      items: [
        {
          label: 'Datasource',
          icon: 'clipboard',
          routerLink: ['/datasources'],
          image: 'assets/Database2.svg',
        },
      ],
      showSubMenu: true,
    },
  ];

  menuItemsFrontend: any[] = [
    {
      label: 'Frontend',
      items: [
        {
          label: 'Applications',
          icon: 'clipboard',
          routerLink: ['/applications'],
          image: 'assets/Application.svg',
        },
        // {
        //   label: 'Pages',
        //   icon: 'clipboard',
        //   routerLink: ['/builder/screens/designer/' + null],
        //   image: 'assets/PAGES.svg',
        // },
        // {
        //   label: 'Actions',
        //   icon: 'clipboard',
        //   routerLink: ['/actions'],
        //   image: 'assets/Action_R.svg',
        // },
        // {
        //   label: 'Components',
        //   icon: 'clipboard',
        //   routerLink: ['/builder/forms/designer/' + null],
        //   image: 'assets/Component _R.svg',
        // },
        {
          label: 'Reports',
          icon: 'clipboard',
          routerLink: ['/builder/reports'],
          image: 'assets/Reports_L.svg',
        },
        // {
        //   label: 'Mobile Builder',
        //   icon: 'clipboard',
        //   routerLink: [''],
        //   externalUrl: 'https://www.splenta.com',
        //   image: 'assets/circum_mobile-1.svg',
        // },
        // {
        //   label: 'Menu Panel',
        //   icon: 'clipboard',
        //   routerLink: ['/panelmenu'],
        //   image:'assets/menu.svg'
        // },
      ],
      showSubMenu: true,
    },
  ];

  menuItemsSettings: any[] = [
    {
      label: 'Utilities',
      items: [
        {
          label: 'Settings',
          icon: 'cog8Tooth',
          routerLink: ['/settings'],
          image: 'assets/settings_L.svg',
        },
        {
          label: 'Business Process',
          icon: 'clipboard',
          routerLink: ['/builder/processes'],
          image: 'assets/Integration_L.svg',
        },
        {
          label: 'Releases',
          icon: 'clipboard',
          routerLink: ['/releases'],
          image: 'assets/Releases-L.svg',
        },
        { label: 'Logs', icon: 'clipboard', routerLink: ['/system-logs'] },
        {
          label: 'Media Manager',
          icon: 'clipboard',
          routerLink: ['/media-manager'],
          image: 'assets/IMAGE ADD.svg',
        },
        // {
        //   label: 'Integrations',
        //   icon: 'clipboard',
        //   routerLink: ['/marketplace'],
        // },
      ],
      showSubMenu: true,
    },
  ];

  roles: any;
  username: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private projectService: ProjectService,
    private layoutService: LayoutService,
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
    const savedMenuItemName = localStorage.getItem('menuItemName');
    if (savedMenuItemName) {
      this.menuView = savedMenuItemName;
    } else {
      this.menuView = 'menuItemsBackend';
      localStorage.setItem('menuItemName', this.menuView);
    }

    this.layoutService.checkForPadding.subscribe(
      (res) => {
        this.giveDefaultPadding = res;
      },
      (err) => {
        this.giveDefaultPadding = true;
      },
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  toggleSideBar() {
    this.layoutService.toggleSidebarVisibility();
  }

  getMenuItems(): any[] {
    if (this.menuView == 'menuItemsBackend') {
      return this.menuItemsBackend;
    } else if (this.menuView == 'menuItemsFrontendWeb') {
      return this.menuItemsFrontend;
    } else if (this.menuView == 'menuItemsFrontendMobile') {
      return this.menuItemsFrontend;
    } else if (this.menuView == 'menuItemsSettings') {
      return this.menuItemsSettings;
    } else if (this.menuView == 'menuItemsDatasource') {
      return this.menuItemsDatasource;
    } else {
      return this.menuItems;
    }
  }

  selectMenuItem(menuItemName: string) {
    this.menuView = menuItemName;
    localStorage.setItem('menuItemName', this.menuView);
  }

  resetMenuItems() {
    this.menuView = '';
    localStorage.removeItem('menuItemName');
  }

  // checkRoute(): void {
  //   const currentUrl = this.router.url;
  //   this.isPageOrComponent =
  //     currentUrl.includes('/builder/screens/designer/') ||
  //     currentUrl.includes('/builder/forms/designer/') ||
  //     currentUrl.includes('/media-manager') ||
  //     currentUrl.includes('/actions') ||
  //     currentUrl.includes('/projects/manage') ||
  //     currentUrl.includes('/builder/mobile-preview') ||
  //     currentUrl.includes('/applications/manage');
  // }
}
