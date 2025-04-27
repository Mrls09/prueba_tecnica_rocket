import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { StatusModalComponent } from '../../../shared/components/status-modal/status-modal.component';
import { Appointment } from '../../../shared/interfaces/appointment';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ConfirmModalComponent,
    StatusModalComponent
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;
  error: string | null = null;
  
  // Variables para el modal de confirmación
  showConfirmModal = false;
  appointmentToDelete: Appointment | null = null;
  confirmMessage = '';
  
  // Variables para el modal de estado
  showStatusModal = false;
  statusMessage = '';
  statusSuccess = true;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.error = null;
    
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las citas: ' + err.message;
        this.loading = false;
      }
    });
  }
  registerMedicalRecord(appointmentId: number): void {
    this.router.navigate(['/medical-records/create', appointmentId]);
  }

  createAppointment(): void {
    this.router.navigate(['/appointments/create']);
  }

  editAppointment(id: number): void {
    this.router.navigate(['/appointments/edit', id]);
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleString();
  }

  openDeleteConfirmation(appointment: Appointment): void {
    this.appointmentToDelete = appointment;
    this.confirmMessage = `¿Está seguro que desea eliminar la cita del paciente ${appointment.patient.name} con el doctor ${appointment.doctor.name}?`;
    this.showConfirmModal = true;
  }

  onConfirmDelete(): void {
    if (this.appointmentToDelete) {
      const appointmentId = this.appointmentToDelete.id!;
      
      this.appointmentService.deleteAppointment(appointmentId).subscribe({
        next: () => {
          this.statusSuccess = true;
          this.statusMessage = `Cita eliminada correctamente`;
          this.showStatusModal = true;
          this.loadAppointments(); // Recargar la lista
        },
        error: (err) => {
          this.statusSuccess = false;
          this.statusMessage = `Error al eliminar la cita: ${err.message}`;
          this.showStatusModal = true;
        }
      });
      
      this.closeConfirmModal();
    }
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.appointmentToDelete = null;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
  }
}