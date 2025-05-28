import { useState } from 'react';
import { ReturnCondition, ReturnFormData, ProblemCategory } from '../../../types/return';
import { Reservation } from '../../../types/reservation';
import { ExclamationTriangleIcon, PaperAirplaneIcon, XMarkIcon, WrenchScrewdriverIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import MultiImageUploader from '../../../components/common/MultiImageUploader';
import EquipmentConditionComparison from '../../equipment/components/EquipmentConditionComparison';

interface ReturnFormProps {
  reservation: Reservation;
  onSubmit: (data: ReturnFormData) => void;
  onCancel: () => void;
}

// Mapa de categorías de problemas para mostrar en la interfaz
const problemCategories: Record<ProblemCategory, string> = {
  desgaste_normal: 'Desgaste normal',
  mal_funcionamiento: 'Mal funcionamiento',
  daño_fisico: 'Daño físico',
  faltante_componente: 'Falta de componentes',
  mal_uso: 'Mal uso por estudiante',
  otro: 'Otro (especificar en observaciones)'
};

export default function ReturnForm({ reservation, onSubmit, onCancel }: ReturnFormProps) {
  const [condition, setCondition] = useState<ReturnCondition>('bueno');
  const [observations, setObservations] = useState('');
  const [hasIssues, setHasIssues] = useState(false);
  const [problemCategory, setProblemCategory] = useState<ProblemCategory | ''>('');
  const [requiresMaintenance, setRequiresMaintenance] = useState(false);
  const [notifyAdmin, setNotifyAdmin] = useState(false);
  const [restrictStudentAccess, setRestrictStudentAccess] = useState(false);
  const [teacherNotes, setTeacherNotes] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [observationsError, setObservationsError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    let hasError = false;
    
    // Validar que si hay problemas, se hayan incluido observaciones
    if (hasIssues && !observations.trim()) {
      setObservationsError('Por favor describe los problemas encontrados en el equipo');
      hasError = true;
    } else {
      setObservationsError('');
    }
    
    // Si hay problemas, validar que se haya seleccionado una categoría
    if (hasIssues && !problemCategory) {
      setCategoryError('Por favor selecciona una categoría para el problema');
      hasError = true;
    } else {
      setCategoryError('');
    }
    
    // Si no hay problemas pero la condición no es buena, pedir observaciones
    if (condition !== 'bueno' && !observations.trim()) {
      setObservationsError('Por favor añade observaciones explicando el estado del equipo');
      hasError = true;
    }
    
    if (hasError) return;
    
    const formData: ReturnFormData = {
      reservationId: reservation.id,
      condition,
      observations: observations.trim() || 'Equipo en buen estado, sin observaciones.',
      hasIssues,
      problemCategory: hasIssues ? (problemCategory as ProblemCategory) : undefined,
      requiresMaintenance: hasIssues ? requiresMaintenance : false,
      notifyAdmin: hasIssues ? notifyAdmin : false,
      restrictStudentAccess: hasIssues ? restrictStudentAccess : false,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      teacherNotes: teacherNotes.trim() || undefined
    };
    
    onSubmit(formData);
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Devolución de equipo
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Registra la devolución e incluye cualquier observación sobre el estado del equipo
          </p>
        </div>
        <button 
          type="button" 
          className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onCancel}
        >
          <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
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
        </dl>
      </div>
      
      {/* Mostrar estado inicial del equipo si existe */}
      {reservation.initialCondition && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
          <div className="mb-4 flex items-center">
            <ArrowsRightLeftIcon className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-base font-medium text-gray-900 dark:text-white">
              Comparación de estado
            </h3>
          </div>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Compara el estado actual del equipo con su estado inicial al momento del préstamo
          </p>
          <EquipmentConditionComparison 
            initialCondition={reservation.initialCondition}
            title="Estado inicial registrado"
          />
        </div>
      )}
      
      {/* Formulario de devolución */}
      <form onSubmit={handleSubmit} className="px-4 py-5 sm:px-6 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-6">
          <div>
            <label className="text-base font-medium text-gray-900 dark:text-white">
              Estado actual del equipo
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selecciona el estado en que se devuelve el equipo
            </p>
            <fieldset className="mt-4">
              <legend className="sr-only">Estado del equipo</legend>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="bueno"
                    name="condition"
                    type="radio"
                    checked={condition === 'bueno'}
                    onChange={() => {
                      setCondition('bueno');
                      setHasIssues(false);
                    }}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="bueno" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bueno - El equipo funciona correctamente y no presenta daños visibles
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
                    id="danado"
                    name="condition"
                    type="radio"
                    checked={condition === 'dañado'}
                    onChange={() => {
                      setCondition('dañado');
                      setHasIssues(true);
                    }}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <label htmlFor="danado" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dañado - El equipo presenta daños significativos o no funciona correctamente
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
          
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="hasIssues"
                name="hasIssues"
                type="checkbox"
                checked={hasIssues}
                onChange={(e) => setHasIssues(e.target.checked)}
                className="h-4 w-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="hasIssues" className="font-medium text-gray-700 dark:text-gray-300">
                Reportar problemas
              </label>
              <p className="text-gray-500 dark:text-gray-400">
                Marca esta opción si el equipo presenta problemas que requieren atención
              </p>
            </div>
          </div>
          
          {/* Sección específica para docentes */}
          {hasIssues && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <h3 className="text-base font-medium text-amber-800 dark:text-amber-300 mb-4">
                <ExclamationTriangleIcon className="h-5 w-5 inline-block mr-2 text-amber-500" />
                Reporte de problemas
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="problemCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoría del problema
                  </label>
                  <select
                    id="problemCategory"
                    name="problemCategory"
                    className={`mt-1 block w-full py-2 px-3 border ${categoryError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:text-white`}
                    value={problemCategory}
                    onChange={(e) => {
                      setProblemCategory(e.target.value as ProblemCategory | '');
                      if (e.target.value) setCategoryError('');
                    }}
                  >
                    <option value="">Selecciona una categoría</option>
                    {Object.entries(problemCategories).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  {categoryError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                      {categoryError}
                    </p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="requiresMaintenance"
                        name="requiresMaintenance"
                        type="checkbox"
                        checked={requiresMaintenance}
                        onChange={(e) => setRequiresMaintenance(e.target.checked)}
                        className="h-4 w-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="requiresMaintenance" className="font-medium text-gray-700 dark:text-gray-300">
                        Requiere mantenimiento
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        El equipo necesita revisión técnica o reparación
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="notifyAdmin"
                        name="notifyAdmin"
                        type="checkbox"
                        checked={notifyAdmin}
                        onChange={(e) => setNotifyAdmin(e.target.checked)}
                        className="h-4 w-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notifyAdmin" className="font-medium text-gray-700 dark:text-gray-300">
                        Notificar a administración
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Envía una alerta al administrador sobre este problema
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="restrictStudentAccess"
                        name="restrictStudentAccess"
                        type="checkbox"
                        checked={restrictStudentAccess}
                        onChange={(e) => setRestrictStudentAccess(e.target.checked)}
                        className="h-4 w-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="restrictStudentAccess" className="font-medium text-gray-700 dark:text-gray-300">
                        Restringir acceso al estudiante
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Impide que el estudiante pueda reservar este equipo nuevamente
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Documentación fotográfica */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Documentación fotográfica (opcional)
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Agrega fotos que muestren el estado o los daños del equipo
                  </p>
                  <MultiImageUploader
                    onChange={setImageUrls}
                    maxImages={5}
                  />
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="observations" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Observaciones generales
            </label>
            <div className="mt-1">
              <textarea
                id="observations"
                name="observations"
                rows={4}
                className={`shadow-sm block w-full sm:text-sm border-gray-300 rounded-md
                  ${observationsError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary-500 focus:border-primary-500'}
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                placeholder="Describe el estado del equipo, daños encontrados o cualquier otra observación relevante"
                value={observations}
                onChange={(e) => {
                  setObservations(e.target.value);
                  if (e.target.value.trim()) {
                    setObservationsError('');
                  }
                }}
              />
              {observationsError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 inline mr-1" />
                  {observationsError}
                </p>
              )}
              {(condition !== 'bueno' || hasIssues) && !observationsError && (
                <p className="mt-2 text-sm text-amber-600 dark:text-amber-500">
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 inline mr-1" />
                  Por favor incluye detalles sobre el estado del equipo
                </p>
              )}
            </div>
          </div>
          
          {/* Sección de cambios respecto al estado inicial */}
          {reservation.initialCondition && (
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h3 className="text-base font-medium text-blue-800 dark:text-blue-300 mb-4">
                <ArrowsRightLeftIcon className="h-5 w-5 inline-block mr-2 text-blue-500" />
                Cambios respecto al estado inicial
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                Por favor detalla cualquier cambio significativo respecto al estado en que fue entregado el equipo
              </p>
              <div className="mt-1">
                <textarea
                  rows={3}
                  className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Describe los cambios específicos entre el estado inicial y el actual..."
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {/* Notas específicas para docentes (si no hay estado inicial registrado) */}
          {!reservation.initialCondition && (
            <div>
              <label htmlFor="teacherNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notas del docente (privadas)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Estas notas serán visibles solo para docentes y administradores
              </p>
              <div className="mt-1">
                <textarea
                  id="teacherNotes"
                  name="teacherNotes"
                  rows={3}
                  className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Añade comentarios sobre el comportamiento del estudiante, uso del equipo, o recomendaciones para futuras reservas..."
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {hasIssues && requiresMaintenance && (
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800 flex items-center">
              <WrenchScrewdriverIcon className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Solicitud de mantenimiento</h4>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Se notificará al departamento técnico para revisar y reparar este equipo.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PaperAirplaneIcon className="h-5 w-5 mr-2" />
              Registrar devolución
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}