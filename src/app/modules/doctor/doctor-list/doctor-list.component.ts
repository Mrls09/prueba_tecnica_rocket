import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../../../shared/services/doctor.service';
import { Doctor } from '../../../shared/interfaces/doctor';
import { ConfirmModalComponent } from "../../../shared/components/confirm-modal/confirm-modal.component";
import { StatusModalComponent } from "../../../shared/components/status-modal/status-modal.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ConfirmModalComponent,
    StatusModalComponent
  ],
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css'] // Cambia de .scss a .css
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  loading = false;
  error: string | null = null;
  
  // Variables para el modal de confirmación
  showConfirmModal = false;
  doctorToDelete: Doctor | null = null;
  confirmMessage = '';
  
  // Variables para el modal de estado
  showStatusModal = false;
  statusMessage = '';
  statusSuccess = true;

  constructor(
    private doctorService: DoctorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading = true;
    this.error = null;
    
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los doctores: ' + err.message;
        this.loading = false;
      }
    });
  }

  createDoctor(): void {
    this.router.navigate(['/doctors/create']);
  }

  editDoctor(id: number): void {
    this.router.navigate(['/doctors/edit', id]);
  }

  openDeleteConfirmation(doctor: Doctor): void {
    this.doctorToDelete = doctor;
    this.confirmMessage = `¿Está seguro que desea eliminar al médico ${doctor.name}?`;
    this.showConfirmModal = true;
  }

  onConfirmDelete(): void {
    if (this.doctorToDelete) {
      const doctorId = this.doctorToDelete.id!;
      
      this.doctorService.deleteDoctor(doctorId).subscribe({
        next: () => {
          this.statusSuccess = true;
          this.statusMessage = `Doctor ${this.doctorToDelete?.name} eliminado correctamente`;
          this.showStatusModal = true;
          this.loadDoctors(); // Recargar la lista
        },
        error: (err) => {
          this.statusSuccess = false;
          this.statusMessage = `Error al eliminar el doctor: ${err.message}`;
          this.showStatusModal = true;
        }
      });
      
      this.closeConfirmModal();
    }
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.doctorToDelete = null;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
  }
}