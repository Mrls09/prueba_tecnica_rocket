import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PatientService } from '../../../shared/services/patient.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { StatusModalComponent } from '../../../shared/components/status-modal/status-modal.component';
import { Patient } from '../../../shared/interfaces/patient';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ConfirmModalComponent,
    StatusModalComponent
  ],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  loading = false;
  error: string | null = null;
  
  // Variables para el modal de confirmación
  showConfirmModal = false;
  patientToDelete: Patient | null = null;
  confirmMessage = '';
  
  // Variables para el modal de estado
  showStatusModal = false;
  statusMessage = '';
  statusSuccess = true;

  constructor(
    private patientService: PatientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.error = null;
    
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los pacientes: ' + err.message;
        this.loading = false;
      }
    });
  }

  createPatient(): void {
    this.router.navigate(['/patients/create']);
  }

  editPatient(id: number): void {
    this.router.navigate(['/patients/edit', id]);
  }

  openDeleteConfirmation(patient: Patient): void {
    this.patientToDelete = patient;
    this.confirmMessage = `¿Está seguro que desea eliminar al paciente ${patient.name}?`;
    this.showConfirmModal = true;
  }

  onConfirmDelete(): void {
    if (this.patientToDelete) {
      const patientId = this.patientToDelete.id!;
      
      this.patientService.deletePatient(patientId).subscribe({
        next: () => {
          this.statusSuccess = true;
          this.statusMessage = `Paciente ${this.patientToDelete?.name} eliminado correctamente`;
          this.showStatusModal = true;
          this.loadPatients(); // Recargar la lista
        },
        error: (err) => {
          this.statusSuccess = false;
          this.statusMessage = `Error al eliminar el paciente: ${err.message}`;
          this.showStatusModal = true;
        }
      });
      
      this.closeConfirmModal();
    }
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.patientToDelete = null;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
  }
}