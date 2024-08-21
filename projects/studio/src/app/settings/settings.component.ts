import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { GenericComponent } from '../utils/genericcomponent';
import { Setting } from './setting';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent extends GenericComponent implements OnInit {
  componentName: string = 'Settings';

  form: FormGroup;
  data: Setting[] = [];
  keys: string[] = [
    'GATEWAY_URL',
    'GITSERVER_URL',
    'BACKEND_OUT_DIR',
    'GITSERVER_ACCESS_TOKEN',
    'GITSERVER_UN',
    'GITSERVER_PWD',
    'WEB_OUT_DIR',
    'MOBILE_OUT_DIR',
  ];

  settings: any[] = [];

  constructor(
    private fb: FormBuilder,
    settingService: SettingsService,
    messageService: MessageService,
    private router: Router,
    private stngService: SettingsService,
  ) {
    super(settingService, messageService);
    this.form = this.fb.group({
      id: '',
      key: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      ServiceName: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
    });
  }
  ngOnInit(): void {
    this.getAllData(this.setValues);
  }

  setValues = (res: any) => {
    this.keys.forEach((e) => {
      var i = this.data.findIndex((t) => t.key == e);
      if (i < 0) {
        this.data.push({ id: null, key: e, value: '' });
      }
    });
  };

  saveAllData() {
    this.stngService.saveSettings(this.data).then((res) => {
      this.data = res;
      this.messageService.add({
        severity: 'success',
        detail: 'Settings Saved',
        summary: 'Success',
      });
    });
  }

  getSetting(key: string) {
    return this.data.findIndex((t) => t.key === key);
  }

  addSetting($event: any, key: string) {
    this.data.push({ key: key, value: $event });
  }
}
