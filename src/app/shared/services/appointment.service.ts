import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment } from '../interfaces/appointment';
import { ApiResponse } from '../interfaces/api_response';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointment`;

  constructor(private http: HttpClient) { }

  // Obtener todas las citas
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<ApiResponse<Appointment[]>>(`${this.apiUrl}/get-all`)
      .pipe(
        map(response => response.data)
      );
  }

  // Obtener una cita por ID
  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<ApiResponse<Appointment>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  // Crear una nueva cita
  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<ApiResponse<Appointment>>(`${this.apiUrl}/create`, appointment)
      .pipe(
        map(response => response.data)
      );
  }

  // Actualizar los datos de una cita
  updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    return this.http.put<ApiResponse<Appointment>>(`${this.apiUrl}/update/${id}`, appointment)
      .pipe(
        map(response => response.data)
      );
  }

  // Eliminar una cita
  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete/${id}`)
      .pipe(
        map(response => response.data)
      );
  }
}