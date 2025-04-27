import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PatientService } from '../../../shared/services/patient.service';
import { StatusModalComponent } from '../../../shared/components/status-modal/status-modal.component';
import { Patient } from '../../../shared/interfaces/patient';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    StatusModalComponent
  ],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {
  patientForm!: FormGroup;
  isEditMode = false;
  patientId?: number;
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
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Verificar si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.patientId = +params['id'];
        this.loadPatientData(this.patientId);
      }
    });
  }

  initForm(): void {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
      medicalHistory: ['', [Validators.maxLength(500)]]
    });
  }

  loadPatientData(id: number): void {
    this.loading = true;
    
    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patientForm.patchValue({
          name: patient.name,
          age: patient.age,
          medicalHistory: patient.medical_history || ''
        });
        this.loading = false;
      },
      error: (err) => {
        this.showStatusModal = true;
        this.statusSuccess = false;
        this.statusMessage = `Error al cargar los datos del paciente: ${err.message}`;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.patientForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const patientData: Patient = {
      id: this.isEditMode ? this.patientId : undefined,
      name: this.patientForm.get('name')?.value,
      age: this.patientForm.get('age')?.value,
      medical_history: this.patientForm.get('medicalHistory')?.value || undefined
    };
    
    if (this.isEditMode && this.patientId) {
      this.updatePatient(this.patientId, patientData);
    } else {
      this.createPatient(patientData);
    }
  }

  createPatient(patient: Patient): void {
    this.patientService.createPatient(patient).subscribe({
      next: () => {
        this.statusSuccess = true;
        this.statusMessage = 'Paciente creado correctamente';
        this.showStatusModal = true;
        this.loading = false;
      },
      error: (err) => {
        this.statusSuccess = false;
        this.statusMessage = `Error al crear el paciente: ${err.message}`;
        this.showStatusModal = true;
        this.loading = false;
      }
    });
  }

  updatePatient(id: number, patient: Patient): void {
    this.patientService.updatePatient(id, patient).subscribe({
      next: () => {
        this.statusSuccess = true;
        this.statusMessage = 'Paciente actualizado correctamente';
        this.showStatusModal = true;
        this.loading = false;
      },
      error: (err) => {
        this.statusSuccess = false;
        this.statusMessage = `Error al actualizar el paciente: ${err.message}`;
        this.showStatusModal = true;
        this.loading = false;
      }
    });
  }

  get f() {
    return this.patientForm.controls;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    
    // Si fue exitoso, redirigir a la lista
    if (this.statusSuccess) {
      this.router.navigate(['/patients']);
    }
  }

  cancel(): void {
    this.router.navigate(['/patients']);
  }
}