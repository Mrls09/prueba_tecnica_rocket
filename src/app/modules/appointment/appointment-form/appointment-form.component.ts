import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { DoctorService } from '../../../shared/services/doctor.service';
import { PatientService } from '../../../shared/services/patient.service';
import { StatusModalComponent } from '../../../shared/components/status-modal/status-modal.component';
import { forkJoin } from 'rxjs';
import { Doctor } from '../../../shared/interfaces/doctor';
import { Patient } from '../../../shared/interfaces/patient';
import { Appointment } from '../../../shared/interfaces/appointment';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    StatusModalComponent
  ],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup;
  isEditMode = false;
  appointmentId?: number;
  loading = false;
  submitted = false;
  
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  
  // Variables para el modal de estado
  showStatusModal = false;
  statusMessage = '';
  statusSuccess = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadDoctorsAndPatients();
    
    // Verificar si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.appointmentId = +params['id'];
        this.loadAppointmentData(this.appointmentId);
      }
    });
  }

  initForm(): void {
    this.appointmentForm = this.fb.group({
      appointmentDate: ['', [Validators.required]],
      appointmentTime: ['', [Validators.required]],
      doctorId: ['', [Validators.required]],
      patientId: ['', [Validators.required]]
    });
  }

  loadDoctorsAndPatients(): void {
    this.loading = true;
    
    forkJoin({
      doctors: this.doctorService.getDoctors(),
      patients: this.patientService.getPatients()
    }).subscribe({
      next: (result) => {
        this.doctors = result.doctors;
        this.patients = result.patients;
        this.loading = false;
      },
      error: (err) => {
        this.showStatusModal = true;
        this.statusSuccess = false;
        this.statusMessage = `Error al cargar los datos: ${err.message}`;
        this.loading = false;
      }
    });
  }

  loadAppointmentData(id: number): void {
    this.loading = true;
    
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment) => {
        // Extraer fecha y hora de appointmentDate
        const appointmentDate = new Date(appointment.appointmentDate);
        const date = appointmentDate.toISOString().split('T')[0]; // formato YYYY-MM-DD
        
        // Formatear la hora (HH:MM)
        const hours = appointmentDate.getHours().toString().padStart(2, '0');
        const minutes = appointmentDate.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        
        this.appointmentForm.patchValue({
          appointmentDate: date,
          appointmentTime: time,
          doctorId: appointment.doctor.id,
          patientId: appointment.patient.id
        });
        
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

  onSubmit(): void {
    this.submitted = true;
    
    if (this.appointmentForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Combinar fecha y hora
    const dateStr = this.appointmentForm.get('appointmentDate')?.value;
    const timeStr = this.appointmentForm.get('appointmentTime')?.value;
    const dateTime = new Date(`${dateStr}T${timeStr}`);
    
    const doctorId = +this.appointmentForm.get('doctorId')?.value;
    const patientId = +this.appointmentForm.get('patientId')?.value;
    
    const doctor = this.doctors.find(d => d.id === doctorId);
    const patient = this.patients.find(p => p.id === patientId);
    
    if (!doctor || !patient) {
      this.statusSuccess = false;
      this.statusMessage = 'Error: No se pudo encontrar el doctor o paciente seleccionado';
      this.showStatusModal = true;
      this.loading = false;
      return;
    }
    
    // Adaptamos la estructura para que coincida con lo que espera el backend
    const appointmentData: Appointment = {
      id: this.isEditMode ? this.appointmentId : undefined,
      appointmentDate: dateTime,
      doctor: doctor,
      patient: patient
    };
    
    if (this.isEditMode && this.appointmentId) {
      this.updateAppointment(this.appointmentId, appointmentData);
    } else {
      this.createAppointment(appointmentData);
    }
  }

  createAppointment(appointment: Appointment): void {
    this.appointmentService.createAppointment(appointment).subscribe({
      next: () => {
        this.statusSuccess = true;
        this.statusMessage = 'Cita creada correctamente';
        this.showStatusModal = true;
        this.loading = false;
      },
      error: (err) => {
        this.statusSuccess = false;
        this.statusMessage = `Error al crear la cita: ${err.message}`;
        this.showStatusModal = true;
        this.loading = false;
      }
    });
  }

  updateAppointment(id: number, appointment: Appointment): void {
    this.appointmentService.updateAppointment(id, appointment).subscribe({
      next: () => {
        this.statusSuccess = true;
        this.statusMessage = 'Cita actualizada correctamente';
        this.showStatusModal = true;
        this.loading = false;
      },
      error: (err) => {
        this.statusSuccess = false;
        this.statusMessage = `Error al actualizar la cita: ${err.message}`;
        this.showStatusModal = true;
        this.loading = false;
      }
    });
  }

  get f() {
    return this.appointmentForm.controls;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    
    // Si fue exitoso, redirigir a la lista
    if (this.statusSuccess) {
      this.router.navigate(['/appointments']);
    }
  }

  cancel(): void {
    this.router.navigate(['/appointments']);
  }
}