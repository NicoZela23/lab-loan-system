// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\features\reservations\pages\ReservationPage.tsx
import { useState } from 'react';
import { Equipment } from '../../../types/equipment';
import { Reservation, ReservationFormData } from '../../../types/reservation';
import { ServiceRatingFormData } from '../../../types/feedback';
import EquipmentList from '../../equipment/components/EquipmentList';
import ReservationForm from '../components/ReservationForm';
import ReservationSuccessModal from '../../../components/modals/ReservationSuccessModal';
import ServiceRatingModal from '../../../components/modals/ServiceRatingModal';
import { MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Para demo: equipos de muestra
const demoEquipments: Equipment[] = [
  {
    id: 1,
    name: 'Microscopio Digital',
    description: 'Microscopio digital de alta resolución con conexión USB y ampliación de hasta 1000x.',
    imageUrl: 'https://images.unsplash.com/photo-1606206522398-de3bd05b1615?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 2,
    name: 'Kit de Arduino Uno',
    description: 'Kit completo de Arduino Uno con diversos componentes electrónicos para prácticas de programación.',
    imageUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80'
  },
  {
    id: 3,
    name: 'Osciloscopio Digital',
    description: 'Osciloscopio digital de 2 canales, 100MHz con pantalla LCD a color.',
    imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 4,
    name: 'Multímetro Digital',
    description: 'Multímetro digital profesional para mediciones de voltaje, corriente y resistencia.',
    imageUrl: 'https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
  }
];

// Demo: reservas completadas para mostrar la funcionalidad de calificación
const demoCompletedReservations: Reservation[] = [
  {
    id: 9876,
    equipmentId: 3,
    equipment: demoEquipments.find(eq => eq.id === 3),
    studentId: 12345,
    studentName: 'Estudiante Demo',
    startDate: new Date(2023, 3, 10, 14, 0),
    endDate: new Date(2023, 3, 10, 16, 0),
    status: 'completada',
    notes: 'Préstamo para práctica de laboratorio',
    createdAt: new Date(2023, 3, 8)
  }
];

export default function ReservationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [newReservation, setNewReservation] = useState<Reservation | null>(null);
  
  // Estados para la funcionalidad de calificación
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [completedReservations, setCompletedReservations] = useState<Reservation[]>(demoCompletedReservations);
  const [selectedReservationForRating, setSelectedReservationForRating] = useState<Reservation | null>(null);
  const [ratedReservations, setRatedReservations] = useState<number[]>([]);
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);
  
  const filteredEquipments = demoEquipments.filter(equipment => 
    equipment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    equipment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleReserveClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelForm = () => {
    setSelectedEquipment(null);
  };
  
  const handleReservationSubmit = (formData: ReservationFormData) => {
    if (!selectedEquipment) return;
    
    // En un sistema real, aquí se enviaría la reserva al backend
    // y se recibiría una confirmación
    const mockReservation: Reservation = {
      id: Math.floor(Math.random() * 10000),
      equipmentId: formData.equipmentId,
      equipment: selectedEquipment,
      studentId: 12345, // ID del estudiante autenticado (mock)
      studentName: 'Estudiante Demo', // Nombre del estudiante autenticado (mock)
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      status: 'pendiente',
      notes: formData.notes,
      createdAt: new Date()
    };
    
    // Simulamos un pequeño retraso para dar sensación de procesamiento
    setTimeout(() => {
      setNewReservation(mockReservation);
      setReservationSuccess(true);
      setSelectedEquipment(null);
    }, 500);
  };

  // Funciones para manejar la calificación del servicio
  const handleRateService = (reservation: Reservation) => {
    setSelectedReservationForRating(reservation);
    setShowRatingModal(true);
  };
  
  const handleSubmitRating = (ratingData: ServiceRatingFormData) => {
    // En un sistema real, aquí enviaríamos la calificación al backend
    console.log('Calificación enviada:', ratingData);
    
    // Marcamos la reserva como calificada
    setRatedReservations([...ratedReservations, ratingData.reservationId]);
    setShowRatingModal(false);
    
    // Mostramos mensaje de éxito
    setShowRatingSuccess(true);
    setTimeout(() => {
      setShowRatingSuccess(false);
    }, 3000);
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white dark:text-white mb-6">Reserva de Equipos</h1>
        
        {/* Alerta de éxito al enviar calificación */}
        {showRatingSuccess && (
          <div className="mb-6 p-4 rounded-md bg-green-50 dark:bg-green-900/20 flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
            <span className="text-green-800 dark:text-green-300">Gracias por tu evaluación. Tu feedback nos ayuda a mejorar nuestros servicios.</span>
          </div>
        )}
        
        {selectedEquipment ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Reservar {selectedEquipment.name}
            </h2>
            <ReservationForm 
              equipment={selectedEquipment}
              onSubmit={handleReservationSubmit}
              onCancel={handleCancelForm}
            />
          </div>
        ) : (
          <>
            <div className="bg-primary-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Buscar Equipos Disponibles</h2>
              <p className="text-primary-100 mb-4">Selecciona un equipo para reservarlo para una fecha futura.</p>
              
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="Buscar por nombre o descripción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-white dark:text-white">Equipos Disponibles para Reserva</h2>
              <EquipmentList 
                equipments={filteredEquipments}
                onReserve={handleReserveClick}
                showReserveButton={true}
              />
              
              {filteredEquipments.length === 0 && (
                <div className="text-center py-10 bg-white/10 dark:bg-gray-800/40 rounded-lg shadow-inner">
                  <p className="text-gray-300 dark:text-gray-400">
                    {searchQuery.length > 0 
                      ? 'No se encontraron equipos que coincidan con tu búsqueda.' 
                      : 'No hay equipos disponibles en este momento.'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Sección de reservas completadas que pueden ser calificadas */}
            {completedReservations.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white dark:text-white">Reservas Completadas</h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Equipo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {completedReservations.map((reservation) => (
                          <tr key={reservation.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {reservation.equipment?.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(reservation.startDate).toLocaleDateString('es-ES')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Completada
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {ratedReservations.includes(reservation.id) ? (
                                <span className="text-gray-400 dark:text-gray-500">Calificado</span>
                              ) : (
                                <button 
                                  onClick={() => handleRateService(reservation)}
                                  className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                                >
                                  Calificar servicio
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-lg">
              <h3 className="font-medium text-primary-800 dark:text-primary-300">Nota</h3>
              <p className="text-sm text-primary-700 dark:text-primary-400 mt-1">
                Las reservas están sujetas a aprobación por parte del personal administrativo.
                Recibirás una notificación cuando tu reserva sea aprobada o rechazada.
              </p>
            </div>
          </>
        )}
      </div>
      
      <ReservationSuccessModal 
        isOpen={reservationSuccess}
        onClose={() => setReservationSuccess(false)}
        reservation={newReservation}
      />
      
      <ServiceRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        reservation={selectedReservationForRating}
        onSubmitRating={handleSubmitRating}
      />
    </div>
  );
}