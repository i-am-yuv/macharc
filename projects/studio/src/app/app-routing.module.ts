import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionComponent } from './collection/collection.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { DispatcherComponent } from './dispatcher/dispatcher.component';
import { FieldsComponent } from './fields/fields.component';
import { FrontComponent } from './front/front.component';
import { LayoutComponent } from './layout/layout.component';
import { MicroserviceComponent } from './microservice/microservice.component';
import { DesignerComponent } from './screen/designer/designer.component';
import { ScreenComponent } from './screen/screen.component';

import { AclComponent } from './acl/acl.component';
import { ActionsComponent } from './actions/actions.component';
import { AppWizardComponent } from './application/app-wizard/app-wizard.component';
import { ApplicationComponent } from './application/application.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { BusinessLogicAiComponent } from './business-logic/business-logic-ai/business-logic-ai.component';
import { BusinessLogicDesignerComponent } from './business-logic/business-logic-designer/business-logic-designer.component';
import { BusinessLogicComponent } from './business-logic/business-logic.component';
import { EndpointsComponent } from './collection/endpoints/endpoints.component';
import { DataFormComponent } from './data-form/data-form.component';
import { FormDesignerComponent } from './data-form/form-designer/form-designer.component';
import { MenuPanelCreateComponent } from './data-form/menu-panel/menu-panel-create/menu-panel-create.component';
import { MenuPanelComponent } from './data-form/menu-panel/menu-panel.component';
import { DatasourceFormComponent } from './datasource/datasource-form/datasource-form.component';
import { DatasourceListComponent } from './datasource/datasource-list/datasource-list.component';
import { HomeComponent } from './home/home.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { MediaManagerComponent } from './media-manager/media-manager.component';
import { ApidocComponent } from './microservice/apidoc/apidoc.component';
import { MsDatasourceComponent } from './microservice/ms-datasource/ms-datasource.component';
import { MsFormComponent } from './microservice/ms-form/ms-form.component';
import { MobilePreviewComponent } from './mobile-preview/mobile-preview.component';
import { MxflowComponent } from './processes/mxflow/mxflow.component';
import { ProcessesComponent } from './processes/processes.component';
import { ProjectComponent } from './project/project.component';
import { WizardComponent } from './project/wizard/wizard.component';
import { ReleasesComponent } from './releases/releases.component';
import { QueryBuilderComponent } from './reports/query-builder/query-builder.component';
import { ReportDesignerComponent } from './reports/report-designer/report-designer.component';
import { ReportsComponent } from './reports/reports.component';
import { TemplatesComponent } from './screen/templates/templates.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
  path: '',
  component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: FrontComponent },
      {
        path: 'projects',
        component: DispatcherComponent,
        children: [
          { path: '', component: ProjectComponent },
          { path: 'create', component: WizardComponent, data: { step: 0 } },
          { path: 'manage', component: WizardComponent, data: { step: 1 } },
          { path: 'manage/:id', component: WizardComponent, data: { step: 2 } },
        ],
      },
      {
        path: 'datasources',
        component: DispatcherComponent,
        children: [
          { path: '', component: DatasourceComponent },
          { path: 'list', component: DatasourceListComponent },
          { path: 'create', component: DatasourceFormComponent },
          { path: 'edit/:id', component: DatasourceFormComponent },
        ],
      },
      {
        path: 'applications',
        component: DispatcherComponent,
        children: [
          { path: '', component: ApplicationComponent },
          { path: 'create', component: AppWizardComponent, data: { step: 0 } },
          { path: 'manage', component: AppWizardComponent, data: { step: 1 } },
          {
            path: 'manage/:id',
            component: AppWizardComponent,
            data: { step: 2 },
          },
        ],
      },
      { path: 'releases', component: ReleasesComponent },
      { path: 'home', component: HomeComponent },
      { path: 'acl', component: AclComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'marketplace', component: MarketplaceComponent },
      { path: 'microservices/apidoc/:id', component: ApidocComponent },
      {
        path: 'builder',
        children: [
          {
            path: 'microservices',
            component: DispatcherComponent,
            children: [
              { path: '', component: MicroserviceComponent },
              { path: 'create', component: MsFormComponent },
              { path: 'edit/:id', component: MsFormComponent },
              { path: ':id', component: MicroserviceComponent },
            ],
          },
          { path: 'mobile-preview/:pageId', component: MobilePreviewComponent },
          { path: 'datasources/:id', component: MsDatasourceComponent },
          { path: 'collections', component: CollectionComponent },
          { path: 'collections/endpoints/:id', component: EndpointsComponent },
          { path: 'collections/:id', component: CollectionComponent },
          { path: 'fields/:id', component: FieldsComponent },
          {
            path: 'processes',
            component: DispatcherComponent,
            children: [
              { path: '', component: ProcessesComponent },
              { path: 'modeler/:id', component: MxflowComponent },
            ],
          },
          {
            path: 'services',
            component: DispatcherComponent,
            children: [
              { path: '', component: BusinessLogicComponent },
              { path: ':id', component: BusinessLogicComponent },
              {
                path: 'designer/:id',
                component: BusinessLogicDesignerComponent,
              },
              {
                path: 'ai/:id',
                component: BusinessLogicAiComponent,
              },
            ],
          },
          {
            path: 'screens',
            component: DispatcherComponent,
            children: [
              {
                path: '',
                component: ScreenComponent,
              },
              {
                path: 'templates',
                component: TemplatesComponent,
              },
              {
                path: 'templates/:id',
                component: TemplatesComponent,
              },
            ],
          },
          {
            path: 'forms',
            component: DispatcherComponent,
            children: [
              {
                path: '',
                component: DataFormComponent,
              },
              {
                path: 'templates',
                component: TemplatesComponent,
              },
              {
                path: 'templates/:id',
                component: TemplatesComponent,
              },
            ],
          },
          {
            path: 'reports',
            component: DispatcherComponent,
            children: [
              {
                path: '',
                component: ReportsComponent,
              },
              {
                path: 'query-builder',
                component: QueryBuilderComponent,
              },
              {
                path: 'templates',
                component: TemplatesComponent,
              },
              {
                path: 'templates/:id',
                component: TemplatesComponent,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'builder/screens/designer/:id',
    // component: LayoutComponent,
    children: [
      {
        path: '',
        component: DispatcherComponent,
        children: [{ path: '', component: DesignerComponent }],
      },
    ],
  },
  // { path: 'actions', component: ActionsComponent },
  {
    path: 'actions/:id',
    // component: LayoutComponent,
    children: [
      {
        path: '',
        component: DispatcherComponent,
        children: [
          { path: '', component: ActionsComponent },
        ],
      },
    ],
  },
  {
    path: 'builder/forms/designer/:id',
    // component: LayoutComponent, // Wants to open it in full screen with no left side bar
    children: [
      {
        path: '',
        component: DispatcherComponent,
        children: [{ path: '', component: FormDesignerComponent }],
      },
    ],
  },
  {
    path: 'builder/reports/designer/:id',
    component: ReportDesignerComponent,
  },
  {
    path: 'panelmenu',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DispatcherComponent,
        children: [
          { path: '', component: MenuPanelComponent },
          { path: 'create', component: MenuPanelCreateComponent },
        ],
      },
    ],
  },
  {
    path: 'media-manager',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DispatcherComponent,
        children: [
          { path: '', component: MediaManagerComponent },
          { path: 'folder/:id', component: MediaManagerComponent },
        ],
      },
    ],
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
