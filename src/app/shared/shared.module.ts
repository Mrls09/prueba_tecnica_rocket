import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { StatusModalComponent } from './components/status-modal/status-modal.component';

@NgModule({
  // Eliminar declarations completamente
  imports: [
    CommonModule,
    ConfirmModalComponent,
    StatusModalComponent
  ],
  exports: [
    ConfirmModalComponent,
    StatusModalComponent
  ]
})
export class SharedModule { }