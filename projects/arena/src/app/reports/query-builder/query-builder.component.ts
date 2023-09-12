import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js/auto';
import { GenericComponent } from '../../utils/genericcomponent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '@splenta/vezo';
import { ReportQueryService } from './report-query.service';
import { ReportQuery } from './report-query';
import { QueryDefinition } from './QueryDefinition';
import { CollectionService } from '../../collection/collection.service';
import { FieldService } from '../../fields/field.service';
import { FilterBuilder } from '../../utils/FilterBuilder';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class QueryBuilderComponent extends GenericComponent implements OnInit {

  override form!: FormGroup<any>;
  override data: any[] = [];
  override componentName: string = 'Report Queries';

  editorOptions = { theme: 'vs-dark', language: 'sql', formatOnPaste: true, suggest: true, wordWrap: 'on' };
  reportQuery: string = '';
  queryDefinition: QueryDefinition = {};
  showSql: boolean = false;
  chartData: any = [];
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: '#cac7c7',
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,255,0.2)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = true;
  outputType: string = '';
  showQueries: boolean = true;
  savedQueries: ReportQuery[] = [];
  activeQuery: any = {};
  showAddForm: boolean = false;
  primaryCollections: any;
  measure: any = {};
  dimension: string = '';
  dimensions: any[] = [];
  measures: any[] = [];
  primaryCollection: any = {};

  constructor(
    private fb: FormBuilder,
    messageService: MessageService,
    reportQueryService: ReportQueryService,
    private collectionService: CollectionService,
    private fieldService: FieldService
  ) {
    super(reportQueryService, messageService);
    this.form = this.fb.group({
      id: '',
      queryName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      queryDescription: [''],
      queryDefinition: [''],
      queryString: ['']
    })
  }

  ngOnInit() {
    this.getAllData();
    this.collectionService.getAllData().then((res) => {
      this.primaryCollections = res.content;
    })
  }

  checkActiveQuery() {
    if (this.activeQuery.id) {
      this.showQueries = false;
      this.reportQuery = this.activeQuery.queryString;

      if (this.activeQuery.queryDefinition)
        this.queryDefinition = JSON.parse(this.activeQuery.queryDefinition);
      this.primaryCollection = this.queryDefinition.primaryCollection;
      this.loadFields();
    }
  }
  setData() {
    this.lineChartData.datasets[0].data = [65, 59, 80, 81, 56, 55, 40];
  }

  addNewQuery() {
    this.saveData();
    this.form.reset();
    this.showAddForm = false;
  }

  queryItemSelected(item: any) {
    this.activeQuery = item;
    this.form.patchValue({ ...item });
    this.checkActiveQuery();
  }

  queryBuilder() {
    var clauses: any[] = [];
    var groupClauses = '';
    if (this.queryDefinition.measures) {
      this.queryDefinition.measures.forEach((t: any) => {
        var str = t.measureType + '(t_' + t.measureName.toLowerCase() + '.id)';
        clauses.push(str)
      })
      if (this.queryDefinition.dimensions && this.queryDefinition.dimensions?.length > 0) {
        clauses = clauses.concat(this.queryDefinition.dimensions);
        groupClauses = ' group by ' + this.queryDefinition.dimensions?.join(', ');
      }
      this.reportQuery = 'select ' + clauses.join(', ') + ' from t_' + this.queryDefinition.primaryCollection?.collectionName?.toLowerCase() + groupClauses;
      this.form.patchValue({ queryString: this.reportQuery, queryDefinition: JSON.stringify(this.queryDefinition) });
      console.log(this.form.value);

      if (this.form.value.id) {
        this.saveData();
      }
    }
  }
  loadFields() {
    if (this.primaryCollection) {
      this.queryDefinition['primaryCollection'] = {};
      this.queryDefinition.primaryCollection = this.primaryCollection;
      var filterStr = FilterBuilder.equal('collection.id', this.primaryCollection.id);
      this.fieldService.getAllData(undefined, filterStr).then((res) => {
        this.dimensions = res.content
        this.buildMeasures();
      })
    }
  }

  addDimension() {
    if (!this.queryDefinition.dimensions) {
      this.queryDefinition['dimensions'] = [];
    }
    if (this.queryDefinition.dimensions) {
      this.queryDefinition.dimensions.push(this.dimension.split(/\.?(?=[A-Z])/).join('_'));
      console.log(this.queryDefinition);
      this.queryBuilder();
    }
  }

  addMeasure() {
    console.log(this.measure);
    if (!this.queryDefinition.measures) {
      this.queryDefinition['measures'] = [];
    }
    if (this.queryDefinition.measures) {
      this.queryDefinition.measures.push(this.measure);
      console.log(this.queryDefinition);
      this.queryBuilder();
    }
  }

  buildMeasures() {
    var msrs: any[] = [];
    const pc = this.primaryCollection;
    const countVal = {
      measureName: pc?.collectionName, measureType: 'COUNT'
    };
    msrs.push(countVal);
    this.dimensions.forEach((t: any) => {
      if (t.fieldType === 'Integer' || t.fieldType === 'Decimal') {
        var val = {
          measureName: t?.fieldName, measureType: 'SUM'
        };
        msrs.push(val);
      }
    })
    this.measures = msrs;
    console.log(this.measures)
  }
}
