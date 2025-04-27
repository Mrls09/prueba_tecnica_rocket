import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-modal.component.html',
  styleUrls: ['./status-modal.component.css']
})
export class StatusModalComponent {
  @Input() showModal = false;
  @Input() message = '';
  @Input() success = true;
  @Input() title = '';
  @Input() buttonText = 'Aceptar';
  
  @Output() close = new EventEmitter<void>();

  get modalTitle(): string {
    return this.title || (this.success ? 'Operación exitosa' : 'Error');
  }

  onClose(): void {
    this.close.emit();
  }
}