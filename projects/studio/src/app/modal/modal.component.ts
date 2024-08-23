import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() buttonText: string = 'OK';
  @Input() type: 'success' | 'failure' = 'success';
  @Output() close = new EventEmitter<void>();

  get modalClass() {
    return {
      'modal-success': this.type === 'success',
      'modal-failure': this.type === 'failure',
    };
  }

  closeModal() {
    this.close.emit();
  }
}