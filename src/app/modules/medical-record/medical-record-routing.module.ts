import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientHistoryComponent } from './patient-history/patient-history.component';
import { DoctorHistoryComponent } from './doctor-history/doctor-history.component';
import { MedicalRecordFormComponent } from './medical-record-form/medical-record-form.component';

const routes: Routes = [
  { path: 'patient/:id', component: PatientHistoryComponent },
  { path: 'patient', component: PatientHistoryComponent },
  { path: 'doctor/:id', component: DoctorHistoryComponent },
  { path: 'doctor', component: DoctorHistoryComponent },
  { path: 'create/:appointmentId', component: MedicalRecordFormComponent },
  { path: 'edit/:id', component: MedicalRecordFormComponent },
  { path: '', redirectTo: 'patient', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalRecordRoutingModule { }