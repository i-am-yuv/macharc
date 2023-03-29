import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionComponent } from './collection/collection.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { FrontComponent } from './front/front.component';
import { LayoutComponent } from './layout/layout.component';
import { MicroserviceComponent } from './microservice/microservice.component';
import { WorkflowComponent } from './workflow/workflow.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: FrontComponent },
      {
        path: 'builder', children: [
          { path: 'microservices', component: MicroserviceComponent },
          { path: 'datasources', component: DatasourceComponent },
          { path: 'collections', component: CollectionComponent },
          { path: 'workflows', component: WorkflowComponent },
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
