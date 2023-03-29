import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontComponent } from './front/front.component';

import { ModalModule } from '@splenta/vezo/modal';
import { MessageService, VezoModule } from '@splenta/vezo';
import { IconModule } from '@splenta/vezo/icon';
import { MenuModule } from '@splenta/vezo/menu';
import { TableModule } from '@splenta/vezo/table';
import { ButtonModule } from '@splenta/vezo/button';
import { ToastModule } from '@splenta/vezo/toast';
import { MicroserviceComponent } from './microservice/microservice.component';
import { LayoutComponent } from './layout/layout.component';
import { InputModule } from '@splenta/vezo/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { CollectionComponent } from './collection/collection.component';
import { CollectionFormComponent } from './collection/collection-form/collection-form.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { CardModule } from '@splenta/vezo/card';
import { TextareaModule } from '@splenta/vezo/textarea';
import { FieldsComponent } from './fields/fields.component';
import { SelectModule } from '@splenta/vezo/select';

@NgModule({
  declarations: [
    AppComponent,
    FrontComponent,
    MicroserviceComponent,
    LayoutComponent,
    ErrorMessageComponent,
    DatasourceComponent,
    CollectionComponent,
    CollectionFormComponent,
    WorkflowComponent,
    FieldsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ModalModule,
    VezoModule,
    InputModule,
    IconModule,
    MenuModule,
    TableModule,
    ButtonModule,
    ToastModule,
    SelectModule,
    CardModule,
    TextareaModule
  ],
  providers: [HttpClientModule, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
