import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontComponent } from './front/front.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MessageService, VezoModule } from '@splenta/vezo/src/public-api';
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
import { LayoutComponent } from './layout/layout.component';
import { MicroserviceComponent } from './microservice/microservice.component';
import { BlocksComponent } from './screen/blocks/blocks.component';
import { DesignerComponent } from './screen/designer/designer.component';
import { ScreenComponent } from './screen/screen.component';

import { ChartModule } from '@splenta/vezo/chart';
import { ColorpickerModule } from '@splenta/vezo/colorpicker';
import { InputnumberModule } from '@splenta/vezo/inputnumber';
import { SeachfieldModule } from '@splenta/vezo/searchfield';
import { SidebarModule } from '@splenta/vezo/sidebar';
import { NgChartsModule } from 'ng2-charts';
import { NgxLoadingModule } from 'ngx-loading';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { SequentialWorkflowDesignerModule } from 'sequential-workflow-designer-angular';
import { AclComponent } from './acl/acl.component';
import { ActionsComponent } from './actions/actions.component';
import { AppWizardComponent } from './application/app-wizard/app-wizard.component';
import { ApplicationComponent } from './application/application.component';
import { JwtInterceptor } from './auth/JwtInterceptor';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login/login.component';
import { BusinessLogicAiComponent } from './business-logic/business-logic-ai/business-logic-ai.component';
import { BusinessLogicDesignerComponent } from './business-logic/business-logic-designer/business-logic-designer.component';
import { BusinessLogicComponent } from './business-logic/business-logic.component';
import { EndpointsComponent } from './collection/endpoints/endpoints.component';
import { CapitalizePipe } from './data-form/capitalize.pipe';
import { DataFormComponent } from './data-form/data-form.component';
import { FormDesignerComponent } from './data-form/form-designer/form-designer.component';
import { MenuPanelCreateComponent } from './data-form/menu-panel/menu-panel-create/menu-panel-create.component';
import { MenuPanelComponent } from './data-form/menu-panel/menu-panel.component';
import { NestedComponent } from './data-form/nested/nested.component';
import { WidgetTreeNodeComponent } from './data-form/widget-tree-node/widget-tree-node.component';
import { DatasourceFormComponent } from './datasource/datasource-form/datasource-form.component';
import { DatasourceListComponent } from './datasource/datasource-list/datasource-list.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { MediaManagerComponent } from './media-manager/media-manager.component';
import { ApidocComponent } from './microservice/apidoc/apidoc.component';
import { MsDatasourceComponent } from './microservice/ms-datasource/ms-datasource.component';
import { MsFormComponent } from './microservice/ms-form/ms-form.component';
import { MobilePreviewComponent } from './mobile-preview/mobile-preview.component';
import { NgFlutterComponent } from './ng-flutter/ng-flutter.component';
import { MxflowComponent } from './processes/mxflow/mxflow.component';
import { ProcessesComponent } from './processes/processes.component';
import { ProjectComponent } from './project/project.component';
import { ProjectService } from './project/project.service';
import { WizardComponent } from './project/wizard/wizard.component';
import { ReleasesComponent } from './releases/releases.component';
import { QueryBuilderComponent } from './reports/query-builder/query-builder.component';
import { ReportDesignerComponent } from './reports/report-designer/report-designer.component';
import { ReportsComponent } from './reports/reports.component';
import { PropertiesComponent } from './screen/properties/properties.component';
import { Properties2Component } from './screen/properties2/properties2.component';
import { TemplatesComponent } from './screen/templates/templates.component';
import { SettingsComponent } from './settings/settings.component';
import { ContenteditableValueAccessor } from './utils/constenteditable.directive';
import { NgTerminalModule } from 'ng-terminal';
import { PagePreviewComponent } from './screen/page-preview/page-preview.component';
import { NestedPreviewComponent } from './data-form/nested-preview/nested-preview.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { PrimeNGConfig } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';

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
    BusinessLogicComponent,
    FieldsComponent,
    DispatcherComponent,
    ScreenComponent,
    BlocksComponent,
    DesignerComponent,
    BusinessLogicDesignerComponent,
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
    ReportsComponent,
    ReportDesignerComponent,
    QueryBuilderComponent,
    MsFormComponent,
    ProjectComponent,
    WizardComponent,
    ApplicationComponent,
    AppWizardComponent,
    ActionsComponent,
    DatasourceListComponent,
    DatasourceFormComponent,
    BusinessLogicAiComponent,
    WidgetTreeNodeComponent,
    CapitalizePipe,
    MenuPanelComponent,
    MenuPanelCreateComponent,
    NestedComponent,
    MediaManagerComponent,
    Properties2Component,
    MobilePreviewComponent,
    PagePreviewComponent,
    NestedPreviewComponent,
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
    ChartModule,
    SeachfieldModule,
    ColorpickerModule,
    NgTerminalModule,
    NgxLoadingModule.forRoot({}),
    NgFlutterComponent,
    NgxLoadingModule.forRoot({}),
    MultiSelectModule,
    ToggleButtonModule,
    DropdownModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    HttpClientModule,
    MessageService,
    ProjectService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
