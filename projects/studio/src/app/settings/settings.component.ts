import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '@splenta/vezo/src/public-api';
import { GenericComponent } from '../utils/genericcomponent';
import { Setting } from './setting';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends GenericComponent implements OnInit {

  componentName: string = 'Settings';

  form: FormGroup;
  data: Setting[] = [];

  constructor(
    private fb: FormBuilder,
    ServiceService: SettingsService,
    messageService: MessageService,
    private router: Router) {
    super(ServiceService, messageService);
    this.form = this.fb.group({
      id: '',
      key: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      ServiceName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    })
  }
  ngOnInit(): void {
    this.getAllData();
  }


}
