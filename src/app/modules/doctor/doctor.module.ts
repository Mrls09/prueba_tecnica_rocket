import { NgModule } from '@angular/core';
import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';

@NgModule({
  imports: [
    DoctorRoutingModule,
    DoctorListComponent,
    DoctorFormComponent
  ]
})
export class DoctorModule { }