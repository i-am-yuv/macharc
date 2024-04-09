import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontComponent } from './front/front.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, VezoModule } from '@splenta/vezo';
import { AccordionModule } from '@splenta/vezo/accordion';
import { ButtonModule } from '@splenta/vezo/button';
import { CardModule } from '@splenta/vezo/card';
import { CheckboxModule } from '@splenta/vezo/checkbox';
import { DatepickerModule } from '@splenta/vezo/datepicker';
import { FileuploadModule } from '@splenta/vezo/fileupload';
import { IconModule } from '@splenta/vezo/icon';
import { InputModule } from '@splenta/vezo/input';
import { MenuModule } from '@splenta/vezo/menu';
import { ModalModule } from '@splenta/vezo/modal';
import { RadiobuttonModule } from '@splenta/vezo/radiobutton';
import { SelectModule } from '@splenta/vezo/select';
import { SwitchModule } from '@splenta/vezo/switch';
import { TableModule } from '@splenta/vezo/table';
import { TabsModule } from '@splenta/vezo/tabs';
import { TextareaModule } from '@splenta/vezo/textarea';
import { ToastModule } from '@splenta/vezo/toast';
import { DndModule } from 'ngx-drag-drop';
import { CollectionFormComponent } from './collection/collection-form/collection-form.component';
import { CollectionComponent } from './collection/collection.component';
import { DatasourceComponent } from './datasource/datasource.component';
import { DispatcherComponent } from './dispatcher/dispatcher.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { FieldsComponent } from './fields/fields.component';
import { FlowComponent } from './flow/flow.component';
import { LayoutComponent } from './layout/layout.component';
import { MicroserviceComponent } from './microservice/microservice.component';
import { BlocksComponent } from './screen/blocks/blocks.component';
import { DesignerComponent } from './screen/designer/designer.component';
import { ScreenComponent } from './screen/screen.component';
import { WorkflowDesignerComponent } from './workflow/workflow-designer/workflow-designer.component';
import { WorkflowComponent } from './workflow/workflow.component';

import { ChartModule } from '@splenta/vezo/chart';
import { InputnumberModule } from '@splenta/vezo/inputnumber';
import { SidebarModule } from '@splenta/vezo/sidebar';
import { NgChartsModule } from 'ng2-charts';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { SequentialWorkflowDesignerModule } from 'sequential-workflow-designer-angular';
import { AclComponent } from './acl/acl.component';
import { ActionsComponent } from './actions/actions.component';
import { AppWizardComponent } from './application/app-wizard/app-wizard.component';
import { ApplicationComponent } from './application/application.component';
import { JwtInterceptor } from './auth/JwtInterceptor';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login/login.component';
import { EndpointsComponent } from './collection/endpoints/endpoints.component';
import { DataFormComponent } from './data-form/data-form.component';
import { FormDesignerComponent } from './data-form/form-designer/form-designer.component';
import { DiagramComponent } from './diagram/diagram.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { ApidocComponent } from './microservice/apidoc/apidoc.component';
import { MsDatasourceComponent } from './microservice/ms-datasource/ms-datasource.component';
import { MsFormComponent } from './microservice/ms-form/ms-form.component';
import { MxflowComponent } from './processes/mxflow/mxflow.component';
import { ProcessesComponent } from './processes/processes.component';
import { ProjectComponent } from './project/project.component';
import { WizardComponent } from './project/wizard/wizard.component';
import { ReleasesComponent } from './releases/releases.component';
import { QueryBuilderComponent } from './reports/query-builder/query-builder.component';
import { ReportDesignerComponent } from './reports/report-designer/report-designer.component';
import { ReportsComponent } from './reports/reports.component';
import { PropertiesComponent } from './screen/properties/properties.component';
import { TemplatesComponent } from './screen/templates/templates.component';
import { SettingsComponent } from './settings/settings.component';
import { ContenteditableValueAccessor } from './utils/constenteditable.directive';

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
    MxflowComponent,
    ProcessesComponent,
    MarketplaceComponent,
    ReleasesComponent,
    ApidocComponent,
    MsDatasourceComponent,
    PropertiesComponent,
    AclComponent,
    SettingsComponent,
    EndpointsComponent,
    TemplatesComponent,
    ContenteditableValueAccessor,
    LoginComponent,
    DataFormComponent,
    FormDesignerComponent,
    DiagramComponent,
    ReportsComponent,
    ReportDesignerComponent,
    QueryBuilderComponent,
    MsFormComponent,
    ProjectComponent,
    WizardComponent,
    ApplicationComponent,
    AppWizardComponent,
    ActionsComponent
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
    SidebarModule,
    VezoModule,
    InputModule,
    InputnumberModule,
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
    SequentialWorkflowDesignerModule,
    MonacoEditorModule.forRoot(),
    NgChartsModule,
    ChartModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [HttpClientModule, MessageService, AuthService, { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
