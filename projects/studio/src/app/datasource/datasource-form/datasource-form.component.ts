import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { GenericComponent } from '../../utils/genericcomponent';
import { Datasource } from '../datasource';
import { DatasourceService } from '../datasource.service';

@Component({
  selector: 'app-datasource-form',
  templateUrl: './datasource-form.component.html',
  styleUrls: ['./datasource-form.component.scss'],
})
export class DatasourceFormComponent
  extends GenericComponent
  implements OnInit
{
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
    { name: 'API', defaultPort: '' },
  ];

  constructor(
    private fb: FormBuilder,
    dsService: DatasourceService,
    private router: Router,
    messageService: MessageService,
    private dataSourceService: DatasourceService
  ) {
    super(dsService, messageService);
    this.form = this.fb.group({
      id: '',
      dbType: [],
      dataSourceName: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      dbUrl: [''],
      dbHost: ['localhost'],
      dbPort: [''],
      dbDatabaseName: [''],
      username: [''],
      password: [''],
      apiUrl: [''],
      authToken: [''],
      driverClassName: [''],
    });
  }
  ngOnInit(): void {
    this.getAllData();
  }

  override addData(): void {
    super.addData();
    this.form.patchValue({ dbHost: 'localhost' });
  }

  savFormData() {
    this.form.patchValue({ dbType: this.form.value.dbType.name });
    if (!this.form.value.id) {
      delete this.form.value.id;
      this.dataSourceService
        .createDatasource(this.form.value)
        .then((res: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Generated',
            detail: 'DataSource Generated',
          });
        });
    }
  }
  setDefaultPort() {
    var dbType = this.dbTypes.find(
      (t: any) => t.name === this.form.value.dbType
    );
    this.form.patchValue({ dbPort: dbType.defaultPort });
  }

  override postSave(data: any) {
    this.router.navigate(['/datasources']);
  }
}
