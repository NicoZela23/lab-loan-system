// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\types\reservation.ts
import { Equipment, EquipmentConditionRecord } from './equipment';

export type ReservationStatus = 'pendiente' | 'aprobada' | 'rechazada' | 'en_curso' | 'completada' | 'vencida' | 'cancelada';

export interface Reservation {
  id: number;
  equipmentId: number;
  equipment?: Equipment; // Información del equipo reservado
  studentId: number; // En un sistema real, esto sería el ID del usuario autenticado
  studentName: string; // En un sistema real, esto vendría del usuario autenticado
  startDate: Date; // Fecha de inicio de la reserva
  endDate: Date; // Fecha de finalización de la reserva
  status: ReservationStatus;
  createdAt: Date;
  purpose?: string; // Propósito o curso para el que se solicita el equipo
  professorId?: string; // ID del docente que aprueba y entrega el equipo
  professorName?: string; // Nombre del docente que aprueba y entrega el equipo
  comments?: string; // Notas adicionales para la reserva
  // Nuevos campos para el estado físico de los equipos
  initialCondition?: EquipmentConditionRecord; // Estado del equipo al momento de entregarlo
  finalCondition?: EquipmentConditionRecord; // Estado final del equipo al momento de la devolución
}

export interface ReservationFormData {
  equipmentId: number;
  startDate: Date | string;
  endDate: Date | string;
  purpose: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
}

export interface AvailabilityCalendar {
  equipment: Equipment;
  availableSlots: TimeSlot[];
  bookedSlots: TimeSlot[];
}

export interface ReservationActions {
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onCancel?: (id: number) => void;
  onRegisterInitialCondition?: (id: number) => void;
  onRegisterReturn?: (id: number) => void;
}