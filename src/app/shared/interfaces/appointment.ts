import { Doctor } from "./doctor";
import { Patient } from "./patient";


export interface Appointment {
  id?: number;
  appointmentDate: string | Date; // Para manejar fechas desde el backend
  doctor: Doctor;
  patient: Patient;
  doctorId?: number; // Para formularios
  patientId?: number; // Para formularios
}