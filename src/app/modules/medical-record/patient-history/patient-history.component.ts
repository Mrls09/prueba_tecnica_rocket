import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MedicalRecordService } from '../../../shared/services/medical-record.service';
import { PatientService } from '../../../shared/services/patient.service';
import { Patient } from '../../../shared/interfaces/patient';
import { MedicalRecord } from '../../../shared/interfaces/medical-record';


@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.css']
})
export class PatientHistoryComponent implements OnInit {
  patientId?: number;
  patient?: Patient;
  patients: Patient[] = []; // Lista de todos los pacientes
  records: MedicalRecord[] = [];
  loading = false;
  error: string | null = null;
  patientForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private medicalRecordService: MedicalRecordService,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      patientId: ['']
    });

    // Cargar la lista de pacientes
    this.loadPatients();

    // Verificar si viene un ID de paciente en la URL
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.patientId = +params['id'];
        this.patientForm.patchValue({ patientId: this.patientId });
        this.loadPatientData();
        this.loadPatientHistory();
      }
    });

    // Observar cambios en el selector de paciente
    this.patientForm.get('patientId')?.valueChanges.subscribe(value => {
      if (value) {
        this.patientId = +value;
        this.loadPatientData();
        this.loadPatientHistory();
      } else {
        // Reiniciar cuando no hay paciente seleccionado
        this.patient = undefined;
        this.records = [];
      }
    });
  }

  loadPatients(): void {
    this.loading = true;
    
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.loading = false;
      },
      error: (err) => {
        this.error = `Error al cargar la lista de pacientes: ${err.message}`;
        this.loading = false;
      }
    });
  }

  loadPatientData(): void {
    if (!this.patientId) return;
    
    this.loading = true;
    
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.loading = false;
      },
      error: (err) => {
        this.error = `Error al cargar los datos del paciente: ${err.message}`;
        this.loading = false;
      }
    });
  }

  loadPatientHistory(): void {
    if (!this.patientId) return;
    
    this.loading = true;
    this.error = null;
    
    this.medicalRecordService.getRecordsByPatient(this.patientId).subscribe({
      next: (records) => {
        this.records = records;
        this.loading = false;
      },
      error: (err) => {
        this.error = `Error al cargar el historial médico: ${err.message}`;
        this.loading = false;
        this.records = [];
      }
    });
  }
}