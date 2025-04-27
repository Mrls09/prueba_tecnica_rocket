import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Patient } from '../interfaces/patient';
import { ApiResponse } from '../interfaces/api_response';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patient`;

  constructor(private http: HttpClient) { }

  // Obtener todos los pacientes
  getPatients(): Observable<Patient[]> {
    return this.http.get<ApiResponse<Patient[]>>(`${this.apiUrl}/get-all`)
      .pipe(
        map(response => response.data)
      );
  }

  // Obtener un paciente por ID
  getPatientById(id: number): Observable<Patient> {
    return this.http.get<ApiResponse<Patient>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  // Crear un nuevo paciente
  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<ApiResponse<Patient>>(`${this.apiUrl}/create`, patient)
      .pipe(
        map(response => response.data)
      );
  }

  // Actualizar los datos de un paciente
  updatePatient(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<ApiResponse<Patient>>(`${this.apiUrl}/update/${id}`, patient)
      .pipe(
        map(response => response.data)
      );
  }

  // Eliminar un paciente
  deletePatient(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }
}