import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from '@splenta/vezo';
import { GenericComponent } from '../utils/genericcomponent';
import { Datasource } from './datasource';
import { DatasourceService } from './datasource.service';

@Component({
  selector: 'app-datasource',
  templateUrl: './datasource.component.html',
  styleUrls: ['./datasource.component.scss']
})
export class DatasourceComponent extends GenericComponent implements OnInit {


  form: FormGroup<any>;
  data: Datasource[] = [];
  componentName: string = 'Datasource';
  override pageData = {};

  dbTypes: any[] = [
    { name: 'PostgreSQL', defaultPort: '5432' },
    { name: 'MySQL', defaultPort: '3306' },
    { name: 'Oracle', defaultPort: '1521' },
    { name: 'Mongo', defaultPort: '27017' },
    { name: 'MSSQL', defaultPort: '1433' },
    { name: 'API', defaultPort: '' }];

  constructor(
    private fb: FormBuilder,
    dsService: DatasourceService,
    messageService: MessageService,
    private dataSourceService: DatasourceService) {
    super(dsService, messageService);
    this.form = this.fb.group({
      id: '',
      dbType: [],
      dataSourceName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      dbUrl: [''],
      dbHost: ['localhost'],
      dbPort: [''],
      dbDatabaseName: [''],
      username: [''],
      password: [''],
      apiUrl: [''],
      authToken: [''],
      driverClassName: [''],
    })
  }
  ngOnInit(): void {
    this.getAllData();
  }

  override addData(): void {
    super.addData();
    this.form.patchValue({ dbHost: 'localhost' });
  }

  savFormData() {
    if (!this.form.value.id) {
      delete this.form.value.id;
      this.dataSourceService.createDatasource(this.form.value).then((res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Generated', detail: 'DataSource Generated' });
      })
    }
  }
  setDefaultPort() {
    this.form.patchValue({ dbPort: this.form.value.dbType.defaultPort });
    console.log(this.form.value);
  }
}
