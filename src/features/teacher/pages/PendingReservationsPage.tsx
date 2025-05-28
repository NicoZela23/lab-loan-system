import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Reservation } from '../../../types/reservation';
import { CheckCircleIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

// Datos de ejemplo (en una aplicación real, estos datos vendrían del backend)
const mockPendingReservations: Reservation[] = [
  {
    id: 101,
    equipmentId: 1,
    equipment: {
      id: 1,
      name: 'Microscopio Digital',
      description: 'Microscopio digital de alta resolución con capacidad de aumento 40x-1000x y conectividad USB',
      imageUrl: 'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80'
    },
    studentId: 1001,
    studentName: 'Ana García',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días después
    status: 'aprobada',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días antes
    purpose: 'Proyecto de Biología Molecular'
  },
  {
    id: 102,
    equipmentId: 2,
    equipment: {
      id: 2,
      name: 'Kit de Arduino',
      description: 'Kit completo de Arduino con microcontrolador, sensores y componentes electrónicos',
      imageUrl: 'https://images.unsplash.com/photo-1553406830-ef409221512f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80'
    },
    studentId: 1002,
    studentName: 'Carlos Mendoza',
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días después
    status: 'aprobada',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día antes
    purpose: 'Proyecto de Sistemas Embebidos'
  }
];

export default function PendingReservationsPage() {
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // En una aplicación real, cargaríamos los datos del backend
  useEffect(() => {
    // Simulamos la carga de datos
    const fetchPendingReservations = async () => {
      try {
        setLoading(true);
        // Simulamos una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // En una aplicación real, se llamaría a un servicio para obtener los datos
        // const response = await api.getPendingReservations();
        // setPendingReservations(response.data);
        
        setPendingReservations(mockPendingReservations);
        setError(null);
      } catch (err) {
        console.error('Error al cargar reservas pendientes:', err);
        setError('No se pudieron cargar las reservas pendientes. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingReservations();
  }, []);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  
  if (loading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 my-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Préstamos Pendientes de Entrega</h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Aquí puedes revisar los préstamos aprobados pendientes de entrega. Registra el estado inicial del equipo antes de entregarlo al estudiante.
        </p>
        
        {pendingReservations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <CheckCircleIcon className="h-12 w-12 mx-auto text-green-500 dark:text-green-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay préstamos pendientes</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Todos los préstamos aprobados han sido entregados. Revisa más tarde para ver nuevas solicitudes.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Equipo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Fecha préstamo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Propósito
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {pendingReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {reservation.equipment?.imageUrl && (
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={reservation.equipment.imageUrl} 
                                alt={reservation.equipment.name} 
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {reservation.equipment?.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {reservation.equipmentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {reservation.studentName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {reservation.studentId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(reservation.startDate)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Hasta: {formatDate(reservation.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white line-clamp-2">
                          {reservation.purpose || 'No especificado'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-800/30 text-yellow-800 dark:text-yellow-300">
                          Pendiente de entrega
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/teacher/loan-condition/${reservation.id}`}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center"
                        >
                          <ClipboardDocumentCheckIcon className="h-5 w-5 mr-1" />
                          Registrar entrega
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}