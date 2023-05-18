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
import { MxflowComponent } from './workflow/mxflow/mxflow.component';
import { ProcessesComponent } from './processes/processes.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { ReleasesComponent } from './releases/releases.component';
import { ApidocComponent } from './microservice/apidoc/apidoc.component';
import { MsDatasourceComponent } from './microservice/ms-datasource/ms-datasource.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: FrontComponent },
      { path: 'releases', component: ReleasesComponent },
      { path: 'marketplace', component: MarketplaceComponent },
      {
        path: 'builder', children: [
          { path: 'microservices', component: MicroserviceComponent },
          { path: 'microservices/apidoc/:id', component: ApidocComponent },
          { path: 'datasources', component: DatasourceComponent },
          { path: 'datasources/:id', component: MsDatasourceComponent },
          { path: 'flow', component: FlowComponent },
          { path: 'collections', component: CollectionComponent },
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
