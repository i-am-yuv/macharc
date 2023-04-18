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

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: FrontComponent },
      {
        path: 'builder', children: [
          { path: 'microservices', component: MicroserviceComponent },
          { path: 'datasources', component: DatasourceComponent },
          { path: 'flow', component: FlowComponent },
          { path: 'collections', component: CollectionComponent },
          { path: 'collections/:id', component: CollectionComponent },
          { path: 'fields/:id', component: FieldsComponent },
          {
            path: 'workflows', component: DispatcherComponent, children: [
              { path: '', component: WorkflowComponent },
              { path: 'mx', component: MxflowComponent },
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
                path: 'designer',
                component: DesignerComponent
              },
            ]
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
