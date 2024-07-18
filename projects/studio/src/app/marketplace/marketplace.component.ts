import { Component, OnInit } from '@angular/core';
import { GenericComponent } from '../utils/genericcomponent';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from '@splenta/vezo/src/public-api';
import { Marketplace } from './marketplace';
import { MarketplaceService } from './marketplace.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent extends GenericComponent implements OnInit {

  componentName: string = 'Marketplace';
  form: FormGroup;
  data: Marketplace[] = [];

  showGrid: boolean = true;

  constructor(
    private fb: FormBuilder,
    msService: MarketplaceService,
    messageService: MessageService) {
    super(msService, messageService);
    this.form = this.fb.group({
      id: '',
      integrationName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      integrationCode: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      integrationType: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      partnerName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      description: ['']
    })
  }
  ngOnInit(): void {
    this.getAllData();
  }
}
