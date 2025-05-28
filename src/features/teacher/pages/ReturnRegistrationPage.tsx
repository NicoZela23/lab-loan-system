import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Reservation } from '../../../types/reservation';
import { ReturnFormData } from '../../../types/return';
import ReturnForm from '../../returns/components/ReturnForm';
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Datos de ejemplo para desarrollo (en producción vendrían del backend)
const mockReservations: Record<string, Reservation> = {
  '201': {
    id: 201,
    equipmentId: 1,
    equipment: {
      id: 1,
      name: 'Microscopio Digital',
      description: 'Microscopio digital de alta resolución con capacidad de aumento 40x-1000x y conectividad USB',
      imageUrl: 'https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80'
    },
    studentId: 1001,
    studentName: 'Ana García',
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días antes
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 días después
    status: 'en_curso',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días antes
    purpose: 'Proyecto de Biología Molecular',
    professorId: 'P123',
    professorName: 'Dr. José Martínez',
    initialCondition: {
      equipmentId: 1,
      condition: 'excelente',
      observations: 'Equipo en perfecto estado. Todos los componentes funcionan correctamente y sin marcas de uso.',
      imageUrls: ['https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80'],
      recordedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      recordedBy: {
        id: 'P123',
        name: 'Dr. José Martínez',
        role: 'docente'
      }
    }
  },
  '202': {
    id: 202,
    equipmentId: 3,
    equipment: {
      id: 3,
      name: 'Osciloscopio Digital',
      description: 'Osciloscopio digital de 100MHz con pantalla a color y conexión USB',
      imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80'
    },
    studentId: 1003,
    studentName: 'Luis Ramírez',
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días antes
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 días después
    status: 'en_curso',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días antes
    purpose: 'Laboratorio de Circuitos Electrónicos',
    professorId: 'P123',
    professorName: 'Dr. José Martínez',
    initialCondition: {
      equipmentId: 3,
      condition: 'bueno',
      observations: 'Equipo en buen estado. Presenta ligeras marcas de uso pero todos los componentes funcionan correctamente.',
      imageUrls: ['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80'],
      recordedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      recordedBy: {
        id: 'P123',
        name: 'Dr. José Martínez',
        role: 'docente'
      }
    }
  }
};

export default function ReturnRegistrationPage() {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // En una aplicación real, cargaríamos los datos del backend
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        
        if (!reservationId) {
          throw new Error('ID de reserva no proporcionado');
        }
        
        // Simulamos una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // En una aplicación real, se obtendría la reserva del backend
        // const response = await api.getReservationById(reservationId);
        // setReservation(response.data);
        
        // Usar datos de ejemplo para desarrollo
        const mockReservation = mockReservations[reservationId];
        
        if (!mockReservation) {
          throw new Error('Reserva no encontrada');
        }
        
        setReservation(mockReservation);
        setError(null);
      } catch (err) {
        console.error('Error al cargar la reserva:', err);
        setError('No se pudo cargar la información de la reserva. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservation();
  }, [reservationId]);
  
  const handleReturnSubmit = async (data: ReturnFormData) => {
    try {
      setIsSubmitting(true);
      
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En una aplicación real, se enviarían los datos de devolución al backend
      // await api.registerReturn(data);
      
      setIsSuccess(true);
      
      // Redirigir a la lista de préstamos después de 2 segundos
      setTimeout(() => {
        navigate('/teacher/active-loans');
      }, 2000);
      
    } catch (err) {
      console.error('Error al registrar la devolución:', err);
      alert('Hubo un error al registrar la devolución. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/teacher/active-loans');
  };
  
  if (loading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !reservation) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error al cargar la información
              </h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error || 'No se pudo encontrar la reserva solicitada'}
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/teacher/active-loans')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Volver a préstamos activos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 dark:text-green-400" />
          <h2 className="mt-4 text-2xl font-bold text-green-800 dark:text-green-200">
            ¡Devolución registrada con éxito!
          </h2>
          <p className="mt-2 text-green-700 dark:text-green-300">
            El equipo ha sido recibido y registrado correctamente en el sistema.
          </p>
          <p className="mt-4 text-sm text-green-600 dark:text-green-400">
            Redirigiendo automáticamente...
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <button
          type="button"
          className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          onClick={handleCancel}
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Volver a préstamos activos
        </button>
      </div>
      
      {isSubmitting ? (
        <div className="w-full flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Registrando devolución...</p>
        </div>
      ) : (
        <ReturnForm
          reservation={reservation}
          onSubmit={handleReturnSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}