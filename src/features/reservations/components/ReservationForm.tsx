// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\features\reservations\components\ReservationForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Equipment } from '../../../types/equipment';
import { ReservationFormData, TimeSlot } from '../../../types/reservation';
import AvailabilityCalendar from './AvailabilityCalendar';
import { CalendarIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface ReservationFormProps {
  equipment: Equipment;
  onSubmit: (data: ReservationFormData) => void;
  onCancel: () => void;
}

export default function ReservationForm({ equipment, onSubmit, onCancel }: ReservationFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<ReservationFormData>();
  
  // Calculamos las fechas mínimas y máximas permitidas para reservas
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30); // Permitimos reservas hasta 30 días en el futuro
  
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD para input type="date"
  };
  
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(newDate);
    setSelectedTimeSlot(null); // Reseteamos el time slot al cambiar la fecha
  };
  
  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  };
  
  const onFormSubmit = (data: Omit<ReservationFormData, 'startDate' | 'endDate'>) => {
    if (!selectedTimeSlot) return;
    
    const reservationData: ReservationFormData = {
      ...data,
      equipmentId: equipment.id,
      startDate: selectedTimeSlot.start,
      endDate: selectedTimeSlot.end
    };
    
    onSubmit(reservationData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda - Detalles del equipo y selección de fecha */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Equipo a reservar</h3>
            
            <div className="flex items-start space-x-4">
              <img 
                src={equipment.imageUrl || '/placeholder-equipment.jpg'} 
                alt={equipment.name} 
                className="w-24 h-24 object-cover rounded-md"
              />
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white">{equipment.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{equipment.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Seleccionar Fecha</h3>
            </div>
            
            <div className="w-full">
              <label htmlFor="reservation-date" className="form-label">
                Fecha de Reserva
              </label>
              <input
                type="date"
                id="reservation-date"
                className="input-field mt-1"
                min={formatDateForInput(minDate)}
                max={formatDateForInput(maxDate)}
                value={formatDateForInput(selectedDate)}
                onChange={handleDateChange}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Puedes reservar con hasta 30 días de anticipación.
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center mb-4">
              <DocumentTextIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notas adicionales</h3>
            </div>
            
            <textarea
              {...register('notes')}
              rows={4}
              placeholder="Agrega cualquier nota o especificación adicional para tu reserva..."
              className="input-field"
            />
          </div>
        </div>
        
        {/* Columna derecha - Calendario de disponibilidad */}
        <div>
          <AvailabilityCalendar 
            equipment={equipment} 
            selectedDate={selectedDate}
            onSelectTimeSlot={handleTimeSlotSelect}
          />
          
          {selectedTimeSlot && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-green-800 dark:text-green-300 font-medium">Horario seleccionado</span>
              </div>
              <p className="text-green-800 dark:text-green-300 text-sm mt-1">
                {selectedTimeSlot.start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - 
                {selectedTimeSlot.end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                {' '}({selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })})
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!selectedTimeSlot}
          className={`btn-primary ${!selectedTimeSlot ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Confirmar reserva
        </button>
      </div>
    </form>
  );
}