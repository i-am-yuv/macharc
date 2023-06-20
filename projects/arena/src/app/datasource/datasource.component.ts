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

  dbTypes: string[] = ['PostgreSQL', 'MySQL', 'Oracle', 'Mongo', 'MSSQL'];

  constructor(
    private fb: FormBuilder,
    dsService: DatasourceService,
    messageService: MessageService) {
    super(dsService, messageService);
    this.form = this.fb.group({
      id: '',
      dbType: [],
      dataSourceName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      dbUrl: [''],
      dbHost: [''],
      dbPort: [''],
      dbDatabaseName: [''],
      username: [''],
      password: [''],
      authToken: [''],
      driverClassName: [''],
    })
  }
  ngOnInit(): void {
    this.getAllData();
  }

}
