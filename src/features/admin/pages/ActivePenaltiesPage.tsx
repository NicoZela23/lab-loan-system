import { useState } from 'react';
import { ShieldExclamationIcon, XCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type PenaltyStatus = 'active' | 'completed' | 'cancelled';

type Penalty = {
  id: string;
  studentName: string;
  studentId: string;
  reason: string;
  startDate: string;
  endDate: string;
  daysLeft: number;
  status: PenaltyStatus;
};

export default function ActivePenaltiesPage() {
  // Estado para almacenar las sanciones
  const [penalties, setPenalties] = useState<Penalty[]>([
    {
      id: '1',
      studentName: 'Carlos Pérez',
      studentId: 'S001',
      reason: 'Retraso de 3 días en la devolución de microscopio',
      startDate: '2025-05-20',
      endDate: '2025-05-27',
      daysLeft: 5,
      status: 'active'
    },
    {
      id: '2',
      studentName: 'María López',
      studentId: 'S002',
      reason: 'Retraso de 7 días en la devolución de kit de química',
      startDate: '2025-05-15',
      endDate: '2025-05-30',
      daysLeft: 3,
      status: 'active'
    },
    {
      id: '3',
      studentName: 'Juan González',
      studentId: 'S003',
      reason: 'Daño en equipo de laboratorio',
      startDate: '2025-05-18',
      endDate: '2025-06-02',
      daysLeft: 6,
      status: 'active'
    },
    {
      id: '4',
      studentName: 'Ana Martínez',
      studentId: 'S004',
      reason: 'Retraso de 1 día en la devolución de osciloscopio',
      startDate: '2025-05-22',
      endDate: '2025-05-25',
      daysLeft: 0,
      status: 'completed'
    }
  ]);

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para el filtro de estado
  const [statusFilter, setStatusFilter] = useState<PenaltyStatus | 'all'>('all');

  // Función para cancelar una sanción
  const handleCancelPenalty = (id: string) => {
    setPenalties(
      penalties.map(penalty => 
        penalty.id === id ? { ...penalty, status: 'cancelled' as PenaltyStatus } : penalty
      )
    );
  };

  // Filtrar sanciones por término de búsqueda y estado
  const filteredPenalties = penalties.filter(penalty => {
    // Filtrar por término de búsqueda
    const matchesSearch = 
      penalty.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      penalty.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      penalty.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por estado
    const matchesStatus = statusFilter === 'all' || penalty.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Obtener el recuento de sanciones por estado
  const penaltyCounts = {
    active: penalties.filter(p => p.status === 'active').length,
    completed: penalties.filter(p => p.status === 'completed').length,
    cancelled: penalties.filter(p => p.status === 'cancelled').length,
    all: penalties.length
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
            <ShieldExclamationIcon className="h-6 w-6 mr-2 text-gray-500 dark:text-gray-400" />
            Sanciones Activas
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Gestión de sanciones aplicadas a estudiantes por retrasos en devolución
          </p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700/30 border-t border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          {/* Filtro por estado */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                statusFilter === 'all'
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Todas ({penaltyCounts.all})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                statusFilter === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Activas ({penaltyCounts.active})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                statusFilter === 'completed'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Completadas ({penaltyCounts.completed})
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                statusFilter === 'cancelled'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Canceladas ({penaltyCounts.cancelled})
            </button>
          </div>
          
          {/* Búsqueda */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por estudiante o razón..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md leading-5 bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Tabla de sanciones */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estudiante
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Razón
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Periodo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPenalties.map((penalty) => (
              <tr key={penalty.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                        {penalty.studentName.split(' ').map(name => name[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {penalty.studentName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {penalty.studentId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">{penalty.reason}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {new Date(penalty.startDate).toLocaleDateString()} - {new Date(penalty.endDate).toLocaleDateString()}
                  </div>
                  {penalty.status === 'active' && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {penalty.daysLeft} {penalty.daysLeft === 1 ? 'día' : 'días'} restante{penalty.daysLeft !== 1 ? 's' : ''}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    penalty.status === 'active'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : penalty.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {penalty.status === 'active' ? 'Activa' : 
                     penalty.status === 'completed' ? 'Completada' : 'Cancelada'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {penalty.status === 'active' && (
                    <button
                      onClick={() => handleCancelPenalty(penalty.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                    >
                      <XCircleIcon className="h-5 w-5 mr-1" />
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            
            {filteredPenalties.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  No se encontraron sanciones que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Información sobre sanciones */}
      <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
          Acerca de las sanciones
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Las sanciones se aplican automáticamente cuando un estudiante se retrasa en la devolución de material de laboratorio. 
          La duración de la sanción depende de los días de retraso según las reglas configuradas.
          Durante el periodo de sanción, el estudiante no puede solicitar nuevos préstamos de material.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Como administrador, puedes cancelar una sanción activa si hay circunstancias atenuantes que justifiquen la excepción.
        </p>
      </div>
    </div>
  );
}