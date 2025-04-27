import { Appointment } from "./appointment";
import { Doctor } from "./doctor";
import { Patient } from "./patient";

export interface MedicalRecord {
  id?: number;
  appointment: Appointment;
  diagnosis: string;
  treatment: string;
  date: string | Date;
  doctor?: Doctor;
  patient?: Patient;
  appointmentId?: number;
}