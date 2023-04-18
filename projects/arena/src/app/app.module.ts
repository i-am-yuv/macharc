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
import { WorkflowDesignerComponent } from './workflow/workflow-designer/workflow-designer.component';
import { DispatcherComponent } from './dispatcher/dispatcher.component';
import { ScreenComponent } from './screen/screen.component';
import { DesignerComponent } from './screen/designer/designer.component';
import { BlocksComponent } from './screen/blocks/blocks.component';
import { DndModule } from 'ngx-drag-drop';
import { CheckboxModule } from '@splenta/vezo/checkbox';
import { SwitchModule } from '@splenta/vezo/switch';
import { RadiobuttonModule } from '@splenta/vezo/radiobutton';
import { TabsModule } from '@splenta/vezo/tabs';
import { AccordionModule } from '@splenta/vezo/accordion';
import { DatepickerModule } from '@splenta/vezo/datepicker';
import { FileuploadModule } from '@splenta/vezo/fileupload';
import { FlowComponent } from './flow/flow.component';
import { MxflowComponent } from './workflow/mxflow/mxflow.component';
import { SequentialWorkflowDesignerModule } from 'sequential-workflow-designer-angular';

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
    FieldsComponent,
    DispatcherComponent,
    ScreenComponent,
    BlocksComponent,
    DesignerComponent,
    WorkflowDesignerComponent,
    FlowComponent,
    MxflowComponent
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
    TextareaModule,
    CheckboxModule,
    SwitchModule,
    RadiobuttonModule,
    MenuModule,
    DatepickerModule,
    AccordionModule,
    FileuploadModule,
    TabsModule,
    DndModule,
    SequentialWorkflowDesignerModule
  ],
  providers: [HttpClientModule, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
