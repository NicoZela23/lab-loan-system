import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Reservation } from '../../../types/reservation';
import { EquipmentConditionRecord } from '../../../types/equipment';
import { CameraIcon, PhotoIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import MultiImageUploader from '../../../components/common/MultiImageUploader';

// Datos de ejemplo para desarrollo (en producción vendrían del backend)
const mockReservations: Record<string, Reservation> = {
  '101': {
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
  '102': {
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
};

export default function LoanInitialConditionPage() {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Estados para el formulario de condición
  const [condition, setCondition] = useState<'excelente' | 'bueno' | 'regular' | 'deficiente'>('bueno');
  const [observations, setObservations] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      if (!observations.trim()) {
        alert('Por favor, ingresa observaciones sobre el estado del equipo');
        setIsSubmitting(false);
        return;
      }
      
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En una aplicación real, se enviarían los datos al backend
      // const initialConditionRecord: EquipmentConditionRecord = {
      //   equipmentId: reservation?.equipmentId as number,
      //   condition,
      //   observations,
      //   imageUrls,
      //   recordedAt: new Date(),
      //   recordedBy: {
      //     id: 'P123', // En un sistema real, este vendría del usuario autenticado
      //     name: 'Dr. José Martínez',
      //     role: 'docente'
      //   }
      // };
      // await api.registerInitialCondition(reservationId, initialConditionRecord);
      
      setIsSuccess(true);
      
      // Redirigir a la lista de préstamos pendientes después de 2 segundos
      setTimeout(() => {
        navigate('/teacher/pending-loans');
      }, 2000);
      
    } catch (err) {
      console.error('Error al registrar el estado inicial:', err);
      alert('Hubo un error al registrar el estado inicial. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/teacher/pending-loans');
  };
  
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
                  onClick={() => navigate('/teacher/pending-loans')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Volver a préstamos pendientes
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
            ¡Estado inicial registrado con éxito!
          </h2>
          <p className="mt-2 text-green-700 dark:text-green-300">
            El equipo ha sido entregado al estudiante y su estado inicial ha sido registrado correctamente.
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
          Volver a préstamos pendientes
        </button>
      </div>
      
      {isSubmitting ? (
        <div className="w-full flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Registrando estado inicial...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Registro de Estado Inicial
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Documenta el estado físico del equipo antes de entregarlo al estudiante
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">Información del Préstamo</h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Equipo
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {reservation.equipment?.name}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Estudiante
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {reservation.studentName}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Fecha de préstamo
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDate(reservation.startDate)}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Fecha de devolución prevista
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDate(reservation.endDate)}
                </dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Propósito
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {reservation.purpose || 'No especificado'}
                </dd>
              </div>
            </dl>
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
            <div className="space-y-6">
              <div>
                <label className="text-base font-medium text-gray-900 dark:text-white">
                  Estado del equipo
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selecciona el estado actual del equipo antes de entregarlo
                </p>
                <fieldset className="mt-4">
                  <legend className="sr-only">Estado del equipo</legend>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="excelente"
                        name="condition"
                        type="radio"
                        checked={condition === 'excelente'}
                        onChange={() => setCondition('excelente')}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <label htmlFor="excelente" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Excelente - Equipo nuevo o en perfectas condiciones, sin marcas de uso
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="bueno"
                        name="condition"
                        type="radio"
                        checked={condition === 'bueno'}
                        onChange={() => setCondition('bueno')}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <label htmlFor="bueno" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Bueno - El equipo funciona correctamente y presenta mínimas señales de uso
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="regular"
                        name="condition"
                        type="radio"
                        checked={condition === 'regular'}
                        onChange={() => setCondition('regular')}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <label htmlFor="regular" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Regular - El equipo funciona pero presenta desgaste o problemas menores
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="deficiente"
                        name="condition"
                        type="radio"
                        checked={condition === 'deficiente'}
                        onChange={() => setCondition('deficiente')}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <label htmlFor="deficiente" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Deficiente - El equipo presenta daños significativos pero aún es funcional
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
              
              <div>
                <label htmlFor="observations" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Observaciones detalladas
                </label>
                <div className="mt-1">
                  <textarea
                    id="observations"
                    name="observations"
                    rows={4}
                    className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md
                      focus:ring-primary-500 focus:border-primary-500
                      dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Describe el estado del equipo en detalle, mencionando cualquier marca, rasguño o detalle que sea relevante documentar antes de la entrega..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Incluye todas las características relevantes del estado físico actual.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Documentación fotográfica
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Agrega fotos que documenten el estado actual del equipo desde diferentes ángulos
                </p>
                <MultiImageUploader
                  onChange={setImageUrls}
                  maxImages={5}
                />
                {imageUrls.length === 0 && (
                  <div className="mt-2 flex items-center text-sm text-amber-600 dark:text-amber-400">
                    <PhotoIcon className="h-5 w-5 mr-1" />
                    <span>Recomendamos agregar al menos una fotografía del estado del equipo</span>
                  </div>
                )}
              </div>
              
              <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <CameraIcon className="h-5 w-5 mr-2" />
                    Registrar estado y entregar
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}