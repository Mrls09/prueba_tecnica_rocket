import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DoctorService } from '../../../shared/services/doctor.service';
import { StatusModalComponent } from '../../../shared/components/status-modal/status-modal.component';
import { Doctor } from '../../../shared/interfaces/doctor';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    StatusModalComponent
  ],
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css']
})
export class DoctorFormComponent implements OnInit {
  doctorForm!: FormGroup;
  isEditMode = false;
  doctorId?: number;
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
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Verificar si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.doctorId = +params['id'];
        this.loadDoctorData(this.doctorId);
      }
    });
  }

  initForm(): void {
    this.doctorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      specialty: ['', [Validators.maxLength(100)]]
    });
  }

  loadDoctorData(id: number): void {
    this.loading = true;
    
    this.doctorService.getDoctorById(id).subscribe({
      next: (doctor) => {
        this.doctorForm.patchValue({
          name: doctor.name,
          specialty: doctor.specialty || ''
        });
        this.loading = false;
      },
      error: (err) => {
        this.showStatusModal = true;
        this.statusSuccess = false;
        this.statusMessage = `Error al cargar los datos del médico: ${err.message}`;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.doctorForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const doctorData: Doctor = {
      id: this.isEditMode ? this.doctorId : undefined,
      name: this.doctorForm.get('name')?.value,
      specialty: this.doctorForm.get('specialty')?.value || undefined
    };
    
    if (this.isEditMode && this.doctorId) {
      this.updateDoctor(this.doctorId, doctorData);
    } else {
      this.createDoctor(doctorData);
    }
  }

  createDoctor(doctor: Doctor): void {
    this.doctorService.createDoctor(doctor).subscribe({
      next: () => {
        this.statusSuccess = true;
        this.statusMessage = 'Médico creado correctamente';
        this.showStatusModal = true;
        this.loading = false;
      },
      error: (err) => {
        this.statusSuccess = false;
        this.statusMessage = `Error al crear el médico: ${err.message}`;
        this.showStatusModal = true;
        this.loading = false;
      }
    });
  }

  updateDoctor(id: number, doctor: Doctor): void {
    this.doctorService.updateDoctor(id, doctor).subscribe({
      next: () => {
        this.statusSuccess = true;
        this.statusMessage = 'Médico actualizado correctamente';
        this.showStatusModal = true;
        this.loading = false;
      },
      error: (err) => {
        this.statusSuccess = false;
        this.statusMessage = `Error al actualizar el médico: ${err.message}`;
        this.showStatusModal = true;
        this.loading = false;
      }
    });
  }

  get f() {
    return this.doctorForm.controls;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    
    // Si fue exitoso, redirigir a la lista
    if (this.statusSuccess) {
      this.router.navigate(['/doctors']);
    }
  }

  cancel(): void {
    this.router.navigate(['/doctors']);
  }
}