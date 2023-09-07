import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionComponent } from './collection/collection.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { FieldsComponent } from './fields/fields.component';
import { FrontComponent } from './front/front.component';
import { LayoutComponent } from './layout/layout.component';
import { MicroserviceComponent } from './microservice/microservice.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { DispatcherComponent } from './dispatcher/dispatcher.component';
import { WorkflowDesignerComponent } from './workflow/workflow-designer/workflow-designer.component';
import { DesignerComponent } from './screen/designer/designer.component';
import { ScreenComponent } from './screen/screen.component';
import { FlowComponent } from './flow/flow.component';

import { ProcessesComponent } from './processes/processes.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { ReleasesComponent } from './releases/releases.component';
import { ApidocComponent } from './microservice/apidoc/apidoc.component';
import { MsDatasourceComponent } from './microservice/ms-datasource/ms-datasource.component';
import { MxflowComponent } from './processes/mxflow/mxflow.component';
import { AclComponent } from './acl/acl.component';
import { SettingsComponent } from './settings/settings.component';
import { EndpointsComponent } from './collection/endpoints/endpoints.component';
import { TemplatesComponent } from './screen/templates/templates.component';
import { LoginComponent } from './auth/login/login.component';
import { DataFormComponent } from './data-form/data-form.component';
import { FormDesignerComponent } from './data-form/form-designer/form-designer.component';
import { DiagramComponent } from './diagram/diagram.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportDesignerComponent } from './reports/report-designer/report-designer.component';
import { QueryBuilderComponent } from './reports/query-builder/query-builder.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: FrontComponent },
      { path: 'releases', component: ReleasesComponent },
      { path: 'acl', component: AclComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'marketplace', component: MarketplaceComponent },
      { path: 'microservices/apidoc/:id', component: ApidocComponent },
      {
        path: 'builder', children: [
          { path: 'microservices', component: MicroserviceComponent },
          { path: 'diagram', component: DiagramComponent },
          { path: 'datasources', component: DatasourceComponent },
          { path: 'datasources/:id', component: MsDatasourceComponent },
          { path: 'flow', component: FlowComponent },
          { path: 'collections', component: CollectionComponent },
          { path: 'collections/endpoints/:id', component: EndpointsComponent },
          { path: 'collections/:id', component: CollectionComponent },
          { path: 'fields/:id', component: FieldsComponent },
          {
            path: 'processes', component: DispatcherComponent, children: [
              { path: '', component: ProcessesComponent },
              { path: 'modeler/:id', component: MxflowComponent },
            ]
          },
          {
            path: 'workflows', component: DispatcherComponent, children: [
              { path: '', component: WorkflowComponent },
              { path: 'designer/:id', component: WorkflowDesignerComponent }
            ]
          },
          {
            path: 'screens',
            component: DispatcherComponent,
            children: [
              {
                path: '',
                component: ScreenComponent
              },
              {
                path: 'templates',
                component: TemplatesComponent
              }, {
                path: 'templates/:id',
                component: TemplatesComponent
              },
            ]
          },
          {
            path: 'forms',
            component: DispatcherComponent,
            children: [
              {
                path: '',
                component: DataFormComponent
              },
              {
                path: 'templates',
                component: TemplatesComponent
              }, {
                path: 'templates/:id',
                component: TemplatesComponent
              },
            ]
          },
          {
            path: 'reports',
            component: DispatcherComponent,
            children: [
              {
                path: '',
                component: ReportsComponent
              },
              {
                path: 'query-builder',
                component: QueryBuilderComponent
              },
              {
                path: 'templates',
                component: TemplatesComponent
              }, {
                path: 'templates/:id',
                component: TemplatesComponent
              },
            ]
          },
        ]
      }
    ]
  },
  {
    path: 'builder/screens/designer/:id',
    component: DesignerComponent
  },
  {
    path: 'builder/forms/designer/:id',
    component: FormDesignerComponent
  },
  {
    path: 'builder/reports/designer/:id',
    component: ReportDesignerComponent
  },
  {
    path: 'auth/login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
