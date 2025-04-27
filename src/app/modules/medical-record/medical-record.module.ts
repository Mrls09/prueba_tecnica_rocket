import { NgModule } from '@angular/core';
import { MedicalRecordRoutingModule } from './medical-record-routing.module';
import { PatientHistoryComponent } from './patient-history/patient-history.component';
import { DoctorHistoryComponent } from './doctor-history/doctor-history.component';
import { MedicalRecordFormComponent } from './medical-record-form/medical-record-form.component';

@NgModule({
  imports: [
    MedicalRecordRoutingModule,
    PatientHistoryComponent,
    DoctorHistoryComponent,
    MedicalRecordFormComponent
  ]
})
export class MedicalRecordModule { }