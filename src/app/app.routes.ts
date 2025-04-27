import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'doctors',
    loadChildren: () => import('./modules/doctor/doctor.module').then(m => m.DoctorModule)
  },
  {
    path: 'patients',
    loadChildren: () => import('./modules/patient/patient.module').then(m => m.PatientModule)
  },
  {
    path: 'appointments',
    loadChildren: () => import('./modules/appointment/appointment.module').then(m => m.AppointmentModule)
  },
  {
    path: 'medical-records',
    loadChildren: () => import('./modules/medical-record/medical-record.module').then(m => m.MedicalRecordModule)
  },
  { path: '', redirectTo: '/doctors', pathMatch: 'full' },
  { path: '**', redirectTo: '/doctors' }
];