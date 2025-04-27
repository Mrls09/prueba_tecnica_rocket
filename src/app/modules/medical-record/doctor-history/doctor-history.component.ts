import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MedicalRecordService } from '../../../shared/services/medical-record.service';
import { DoctorService } from '../../../shared/services/doctor.service';
import { Doctor } from '../../../shared/interfaces/doctor';
import { MedicalRecord } from '../../../shared/interfaces/medical-record';

@Component({
  selector: 'app-doctor-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './doctor-history.component.html',
  styleUrls: ['./doctor-history.component.css']
})
export class DoctorHistoryComponent implements OnInit {
  doctorId?: number;
  doctor?: Doctor;
  doctors: Doctor[] = []; // Lista de todos los doctores
  records: MedicalRecord[] = [];
  loading = false;
  error: string | null = null;
  doctorForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private medicalRecordService: MedicalRecordService,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.doctorForm = this.fb.group({
      doctorId: ['']
    });

    // Cargar la lista de doctores
    this.loadDoctors();

    // Verificar si viene un ID de doctor en la URL
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.doctorId = +params['id'];
        this.doctorForm.patchValue({ doctorId: this.doctorId });
        this.loadDoctorData();
        this.loadDoctorHistory();
      }
    });

    // Observar cambios en el selector de doctor
    this.doctorForm.get('doctorId')?.valueChanges.subscribe(value => {
      if (value) {
        this.doctorId = +value;
        this.loadDoctorData();
        this.loadDoctorHistory();
      } else {
        // Reiniciar cuando no hay doctor seleccionado
        this.doctor = undefined;
        this.records = [];
      }
    });
  }

  loadDoctors(): void {
    this.loading = true;
    
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.loading = false;
      },
      error: (err) => {
        this.error = `Error al cargar la lista de doctores: ${err.message}`;
        this.loading = false;
      }
    });
  }

  loadDoctorData(): void {
    if (!this.doctorId) return;
    
    this.loading = true;
    
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (doctor) => {
        this.doctor = doctor;
        this.loading = false;
      },
      error: (err) => {
        this.error = `Error al cargar los datos del doctor: ${err.message}`;
        this.loading = false;
      }
    });
  }

  loadDoctorHistory(): void {
    if (!this.doctorId) return;
    
    this.loading = true;
    this.error = null;
    
    this.medicalRecordService.getRecordsByDoctor(this.doctorId).subscribe({
      next: (records) => {
        this.records = records;
        this.loading = false;
      },
      error: (err) => {
        this.error = `Error al cargar el historial de consultas: ${err.message}`;
        this.loading = false;
        this.records = [];
      }
    });
  }
}