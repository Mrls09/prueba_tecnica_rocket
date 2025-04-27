// shared/services/medical-record.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/api_response';
import { MedicalRecord } from '../interfaces/medical-record';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private apiUrl = `${environment.apiUrl}/medical-record`;

  constructor(private http: HttpClient) { }

  // Obtener todos los registros médicos
  getMedicalRecords(): Observable<MedicalRecord[]> {
    return this.http.get<ApiResponse<MedicalRecord[]>>(`${this.apiUrl}/get-all`)
      .pipe(
        map(response => response.data)
      );
  }

  // Obtener registros médicos por paciente
  getRecordsByPatient(patientId: number): Observable<MedicalRecord[]> {
    return this.http.get<ApiResponse<MedicalRecord[]>>(`${this.apiUrl}/patient/${patientId}`)
      .pipe(
        map(response => response.data)
      );
  }

  // Obtener registros médicos por doctor
  getRecordsByDoctor(doctorId: number): Observable<MedicalRecord[]> {
    return this.http.get<ApiResponse<MedicalRecord[]>>(`${this.apiUrl}/doctor/${doctorId}`)
      .pipe(
        map(response => response.data)
      );
  }

  // Obtener un registro médico por ID
  getMedicalRecordById(id: number): Observable<MedicalRecord> {
    return this.http.get<ApiResponse<MedicalRecord>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  // Crear un nuevo registro médico
  createMedicalRecord(record: MedicalRecord): Observable<MedicalRecord> {
    return this.http.post<ApiResponse<MedicalRecord>>(`${this.apiUrl}/create`, record)
      .pipe(
        map(response => response.data)
      );
  }

  // Actualizar un registro médico
  updateMedicalRecord(id: number, record: MedicalRecord): Observable<MedicalRecord> {
    return this.http.put<ApiResponse<MedicalRecord>>(`${this.apiUrl}/update/${id}`, record)
      .pipe(
        map(response => response.data)
      );
  }

  // Eliminar un registro médico
  deleteMedicalRecord(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete/${id}`)
      .pipe(
        map(response => response.data)
      );
  }
}