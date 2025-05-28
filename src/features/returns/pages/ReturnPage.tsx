import { useState, useEffect } from 'react';
import { Reservation } from '../../../types/reservation';
import { ReturnFormData } from '../../../types/return';
import ReturnForm from '../components/ReturnForm';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ReturnPage() {
  const [activeReservations, setActiveReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchActiveReservations();
  }, []);

  const fetchActiveReservations = async () => {
    setLoading(true);
    try {
      // Aquí se implementaría la llamada a la API para obtener reservas activas
      // Por ahora usamos datos mock para el ejemplo
      const mockReservations: Reservation[] = [
        {
          id: '1',
          equipmentId: '101',
          equipment: {
            id: '101',
            name: 'Microscopio Digital',
            category: 'Laboratorio',
            description: 'Microscopio digital de alta resolución',
            imageUrls: ['https://example.com/microscope.jpg'],
            available: true
          },
          studentId: 'S001',
          studentName: 'Ana García',
          professorId: 'P001',
          professorName: 'Dr. Martínez',
          startDate: new Date('2025-04-15'),
          endDate: new Date('2025-04-25'),
          status: 'active',
          purpose: 'Práctica de laboratorio de biología'
        },
        {
          id: '2',
          equipmentId: '102',
          equipment: {
            id: '102',
            name: 'Proyector HDMI',
            category: 'Audiovisual',
            description: 'Proyector de alta definición con conexión HDMI',
            imageUrls: ['https://example.com/projector.jpg'],
            available: true
          },
          studentId: 'S002',
          studentName: 'Carlos Rodríguez',
          professorId: 'P001',
          professorName: 'Dr. Martínez',
          startDate: new Date('2025-04-10'),
          endDate: new Date('2025-04-23'),
          status: 'active',
          purpose: 'Presentación de proyecto final'
        },
        {
          id: '3',
          equipmentId: '103',
          equipment: {
            id: '103',
            name: 'Kit de electrónica',
            category: 'Electrónica',
            description: 'Kit completo de electrónica con componentes y herramientas',
            imageUrls: ['https://example.com/electronics.jpg'],
            available: true
          },
          studentId: 'S003',
          studentName: 'Laura Méndez',
          professorId: 'P002',
          professorName: 'Dra. Sánchez',
          startDate: new Date('2025-04-18'),
          endDate: new Date('2025-04-26'),
          status: 'active',
          purpose: 'Proyecto de sistemas digitales'
        }
      ];
      
      setActiveReservations(mockReservations);
      setError(null);
    } catch (err) {
      console.error('Error al cargar reservas activas:', err);
      setError('No se pudieron cargar los préstamos activos. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnSubmit = async (data: ReturnFormData) => {
    try {
      console.log('Datos de devolución enviados:', data);
      
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar mensaje según la situación
      let message = '';
      
      if (data.hasIssues) {
        if (data.requiresMaintenance) {
          message = 'Devolución registrada con observaciones. Se ha programado mantenimiento del equipo.';
        } else if (data.notifyAdmin) {
          message = 'Devolución registrada con observaciones. Se ha notificado al administrador.';
        } else if (data.restrictStudentAccess) {
          message = 'Devolución registrada con observaciones. Se han aplicado restricciones al estudiante.';
        } else {
          message = 'Devolución registrada con observaciones.';
        }
      } else {
        message = 'Devolución registrada exitosamente.';
      }
      
      // Actualizar la lista de reservas activas (eliminar la devuelta)
      setActiveReservations(prev => 
        prev.filter(reservation => reservation.id !== data.reservationId)
      );
      
      // Mostrar mensaje de éxito
      setSuccessMessage(message);
      setShowSuccessMessage(true);
      setSelectedReservation(null);
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (err) {
      console.error('Error al registrar devolución:', err);
      setError('No se pudo registrar la devolución. Por favor, intenta de nuevo más tarde.');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Registro de Devoluciones
      </h1>
      
      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {selectedReservation ? (
        <ReturnForm 
          reservation={selectedReservation}
          onSubmit={handleReturnSubmit}
          onCancel={() => setSelectedReservation(null)}
        />
      ) : (
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Préstamos activos pendientes de devolución
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : activeReservations.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg py-8 text-center">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay préstamos activos</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Actualmente no hay préstamos pendientes de devolución.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Equipo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fecha préstamo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fecha devolución
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {activeReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {reservation.equipment?.imageUrls && reservation.equipment.imageUrls.length > 0 ? (
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={reservation.equipment.imageUrls[0]} 
                                alt={reservation.equipment.name} 
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                                {reservation.equipment?.name.charAt(0) || 'E'}
                              </span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {reservation.equipment?.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {reservation.equipment?.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{reservation.studentName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {reservation.studentId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(reservation.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(reservation.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300">
                          Activo
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedReservation(reservation)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Registrar devolución
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}