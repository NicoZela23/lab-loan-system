// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\features\reservations\components\AvailabilityCalendar.tsx
import { useState, useEffect } from 'react';
import { Equipment } from '../../../types/equipment';
import { TimeSlot } from '../../../types/reservation';
import { CalendarDaysIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface AvailabilityCalendarProps {
  equipment: Equipment;
  selectedDate: Date;
  onSelectTimeSlot: (slot: TimeSlot) => void;
}

// Función auxiliar para generar slots horarios para demostración
const generateMockTimeSlots = (date: Date, equipment: Equipment): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const baseDate = new Date(date);
  baseDate.setHours(8, 0, 0, 0); // Empezamos a las 8:00 AM
  
  // Generamos slots de 2 horas desde las 8:00 hasta las 18:00
  for (let i = 0; i < 5; i++) {
    const start = new Date(baseDate);
    start.setHours(start.getHours() + (i * 2));
    
    const end = new Date(start);
    end.setHours(end.getHours() + 2);
    
    // Aleatoriamente decidimos si el slot está disponible o no (para demostración)
    // En un sistema real, esto vendría de una consulta al backend
    const isAvailable = Math.random() > 0.3;
    
    slots.push({
      start,
      end,
      isAvailable
    });
  }
  
  return slots;
};

export default function AvailabilityCalendar({ equipment, selectedDate, onSelectTimeSlot }: AvailabilityCalendarProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  
  // Simulamos una carga de disponibilidad basada en el equipo y la fecha seleccionada
  useEffect(() => {
    // En un sistema real, aquí haríamos una petición al backend
    // para obtener la disponibilidad real
    const slots = generateMockTimeSlots(selectedDate, equipment);
    setTimeSlots(slots);
    setSelectedSlot(null);
  }, [selectedDate, equipment]);
  
  const handleSelectSlot = (slot: TimeSlot) => {
    if (!slot.isAvailable) return;
    
    setSelectedSlot(slot);
    onSelectTimeSlot(slot);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center mb-4">
        <CalendarDaysIcon className="h-6 w-6 text-primary-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Horarios Disponibles</h3>
      </div>
      
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
        <p className="mb-2">Selecciona un horario para el día <span className="font-semibold">{selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span></p>
      </div>
      
      <div className="space-y-2">
        {timeSlots.length > 0 ? (
          timeSlots.map((slot, index) => (
            <div 
              key={index} 
              className={`p-3 border rounded-lg flex justify-between items-center cursor-pointer transition-colors ${
                slot.isAvailable 
                  ? selectedSlot === slot
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 hover:border-primary-300 dark:border-gray-700 dark:hover:border-primary-700'
                  : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800'
              }`}
              onClick={() => handleSelectSlot(slot)}
            >
              <div className="flex items-center">
                <span className="font-medium">{formatTime(slot.start)} - {formatTime(slot.end)}</span>
              </div>
              
              <div>
                {slot.isAvailable ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <p>Cargando horarios disponibles...</p>
          </div>
        )}
      </div>
      
      {timeSlots.length > 0 && !timeSlots.some(slot => slot.isAvailable) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200">
          <p>No hay horarios disponibles para esta fecha. Por favor selecciona otra fecha.</p>
        </div>
      )}
    </div>
  );
}