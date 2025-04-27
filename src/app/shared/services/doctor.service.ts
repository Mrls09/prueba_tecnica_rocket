import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Doctor } from '../interfaces/doctor';
import { ApiResponse } from '../interfaces/api_response';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctor`;

  constructor(private http: HttpClient) { }

  // Obtener todos los doctores
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<ApiResponse<Doctor[]>>(`${this.apiUrl}/get-all`)
      .pipe(
        map(response => response.data)
      );
  }

  // Obtener un doctor por ID
  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<ApiResponse<Doctor>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  // Crear un nuevo doctor
  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<ApiResponse<Doctor>>(`${this.apiUrl}/create`, doctor)
      .pipe(
        map(response => response.data)
      );
  }

  // Actualizar los datos de un doctor
  updateDoctor(id: number, doctor: Doctor): Observable<Doctor> {
    return this.http.put<ApiResponse<Doctor>>(`${this.apiUrl}/update/${id}`, doctor)
      .pipe(
        map(response => response.data)
      );
  }

  // Eliminar un doctor
  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete/${id}`)
      .pipe(
        map(response => response.data)
      );
  }
}