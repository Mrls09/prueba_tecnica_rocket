// modules/medical-record/medical-record-form/medical-record-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MedicalRecordService } from '../../../shared/services/medical-record.service';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { StatusModalComponent } from '../../../shared/components/status-modal/status-modal.component';
import { Appointment } from '../../../shared/interfaces/appointment';
import { MedicalRecord } from '../../../shared/interfaces/medical-record';

@Component({
  selector: 'app-medical-record-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    StatusModalComponent
  ],
  templateUrl: './medical-record-form.component.html',
  styleUrls: ['./medical-record-form.component.css']
})
export class MedicalRecordFormComponent implements OnInit {
  recordForm!: FormGroup;
  isEditMode = false;
  recordId?: number;
  appointmentId?: number;
  appointment?: Appointment;
  loading = false;
  submitted = false;
  
  // Variables para el modal de estado
  showStatusModal = false;
  statusMessage = '';
  statusSuccess = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private medicalRecordService: MedicalRecordService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Obtener el ID de la cita desde la URL
    this.route.params.subscribe(params => {
      if (params['appointmentId']) {
        this.appointmentId = +params['appointmentId'];
        this.loadAppointmentData(this.appointmentId);
      }
      
      if (params['id']) {
        this.isEditMode = true;
        this.recordId = +params['id'];
        this.loadRecordData(this.recordId);
      }
    });
  }

  initForm(): void {
    this.recordForm = this.fb.group({
      diagnosis: ['', [Validators.required, Validators.maxLength(500)]],
      treatment: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  loadAppointmentData(id: number): void {
    this.loading = true;
    
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment) => {
        this.appointment = appointment;
        this.loading = false;
      },
      error: (err) => {
        this.showStatusModal = true;
        this.statusSuccess = false;
        this.statusMessage = `Error al cargar los datos de la cita: ${err.message}`;
        this.loading = false;
      }
    });
  }

  loadRecordData(id: number): void {
    this.loading = true;
    
    this.medicalRecordService.getMedicalRecordById(id).subscribe({
      next: (record) => {
        this.appointment = record.appointment;
        
        this.recordForm.patchValue({
          diagnosis: record.diagnosis,
          treatment: record.treatment
        });
        
        this.loading = false;
      },
      error: (err) => {
        this.showStatusModal = true;
        this.statusSuccess = false;
        this.statusMessage = `Error al cargar los datos del registro médico: ${err.message}`;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.recordForm.invalid || !this.appointment) {
      return;
    }
    
    this.loading = true;
    
    const recordData: MedicalRecord = {
      id: this.isEditMode ? this.recordId : undefined,
      appointment: this.appointment,
      diagnosis: this.recordForm.get('diagnosis')?.value,
      treatment: this.recordForm.get('treatment')?.value,
      date: new Date()
    };
    
    if (this.isEditMode && this.recordId) {
      this.updateMedicalRecord(this.recordId, recordData);
    } else {
      this.createMedicalRecord(recordData);
    }
  }

  createMedicalRecord(record: MedicalRecord): void {
    this.medicalRecordService.createMedicalRecord(record).subscribe({
      next: () => {
        this.statusSuccess = true;
        this.statusMessage = 'Registro médico creado correctamente';
        this.showStatusModal = true;
        this.loading = false;
      },
      error: (err) => {
        this.statusSuccess = false;
        this.statusMessage = `Error al crear el registro médico: ${err.message}`;
        this.showStatusModal = true;
        this.loading = false;
      }
    });
  }

  updateMedicalRecord(id: number, record: MedicalRecord): void {
    this.medicalRecordService.updateMedicalRecord(id, record).subscribe({
      next: () => {
        this.statusSuccess = true;
        this.statusMessage = 'Registro médico actualizado correctamente';
        this.showStatusModal = true;
        this.loading = false;
      },
      error: (err) => {
        this.statusSuccess = false;
        this.statusMessage = `Error al actualizar el registro médico: ${err.message}`;
        this.showStatusModal = true;
        this.loading = false;
      }
    });
  }

  get f() {
    return this.recordForm.controls;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    
    // Si fue exitoso, redirigir a la lista de citas
    if (this.statusSuccess) {
      this.router.navigate(['/appointments']);
    }
  }

  cancel(): void {
    this.router.navigate(['/appointments']);
  }
}