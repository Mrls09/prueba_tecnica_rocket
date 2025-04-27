import { NgModule } from '@angular/core';
import { AppointmentRoutingModule } from './appointment-routing.module';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';

@NgModule({
  imports: [
    AppointmentRoutingModule,
    AppointmentListComponent,
    AppointmentFormComponent
  ]
})
export class AppointmentModule { }