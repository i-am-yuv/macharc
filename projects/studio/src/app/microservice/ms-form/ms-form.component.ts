import { Component } from '@angular/core';
import { GenericComponent } from '../../utils/genericcomponent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '@splenta/vezo';
import { MicroserviceService } from '../microservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../project/project.service';

@Component({
  selector: 'app-ms-form',
  templateUrl: './ms-form.component.html',
  styleUrls: ['./ms-form.component.scss']
})
export class MsFormComponent extends GenericComponent {

  override form!: FormGroup<any>;
  override data: any[] = [];
  override componentName: string = 'Microservice Form';
  msId: string | null;
  packaging: any[] = ['Jar', 'War'];
  projects: any[] = [];

  constructor(
    private fb: FormBuilder,
    msService: MicroserviceService,
    messageService: MessageService,
    private projectService: ProjectService,
    private router : Router ,
    private route: ActivatedRoute) {
    super(msService, messageService);
    this.msId = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      id: '',
      microServiceCode: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      microServiceName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      packageName: [''],
      packaging: ['Jar'],
      portNumber: ['', [Validators.required]],
      project: ['']
    })
  }

  ngOnInit(): void {
    if (this.msId) {
      this.getData({ id: this.msId }, this.loadData.bind(this));
    }
    this.projectService.getAllData().then((res: any) => {
      this.projects = res.content;
    })
  }
  loadData(res: any): void {
    this.form.patchValue({ ...res });
  }

  getRouterLink()
  {
     if( this.msId)
      {
        // We are in edit form
        this.router.navigate(['/builder/microservices/' + this.dataSingle?.project?.id]) ;
      }
      else{
        // We are in create form
        this.router.navigate(['/builder/microservices']) ;
      }
  }


}
