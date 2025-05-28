import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Reservation } from '../../../types/reservation';
import { ArrowPathIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

// Datos de ejemplo (en una aplicación real, estos datos vendrían del backend)
const mockActiveLoans: Reservation[] = [
  {
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
  {
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
];

export default function ActiveLoansPage() {
  const [activeLoans, setActiveLoans] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // En una aplicación real, cargaríamos los datos del backend
  useEffect(() => {
    // Simulamos la carga de datos
    const fetchActiveLoans = async () => {
      try {
        setLoading(true);
        // Simulamos una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // En una aplicación real, se llamaría a un servicio para obtener los datos
        // const response = await api.getActiveLoans();
        // setActiveLoans(response.data);
        
        setActiveLoans(mockActiveLoans);
        setError(null);
      } catch (err) {
        console.error('Error al cargar préstamos activos:', err);
        setError('No se pudieron cargar los préstamos activos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchActiveLoans();
  }, []);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getRemainingDays = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Vencido hace ${Math.abs(diffDays)} días`;
    } else if (diffDays === 0) {
      return 'Vence hoy';
    } else if (diffDays === 1) {
      return 'Vence mañana';
    } else {
      return `${diffDays} días restantes`;
    }
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Préstamos Activos</h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Aquí puedes ver todos los préstamos activos actualmente y registrar la devolución de los equipos.
        </p>
        
        {activeLoans.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <DocumentArrowDownIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay préstamos activos</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Actualmente no hay equipos prestados. Los préstamos activos aparecerán aquí.
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
                      Devolución
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Estado inicial
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {activeLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {loan.equipment?.imageUrl && (
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={loan.equipment.imageUrl} 
                                alt={loan.equipment.name} 
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {loan.equipment?.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {loan.purpose}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {loan.studentName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(loan.startDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(loan.endDate)}
                        </div>
                        <div className={`text-xs mt-1 font-medium ${
                          new Date(loan.endDate) < new Date() 
                            ? 'text-red-600 dark:text-red-400' 
                            : new Date(loan.endDate).getTime() - new Date().getTime() < 2 * 24 * 60 * 60 * 1000 
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-green-600 dark:text-green-400'
                        }`}>
                          {getRemainingDays(loan.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          loan.initialCondition?.condition === 'excelente' 
                            ? 'bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300'
                            : loan.initialCondition?.condition === 'bueno'
                              ? 'bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300'
                              : loan.initialCondition?.condition === 'regular'
                                ? 'bg-yellow-100 dark:bg-yellow-800/30 text-yellow-800 dark:text-yellow-300'
                                : 'bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-300'
                        }`}>
                          {loan.initialCondition?.condition.charAt(0).toUpperCase() + loan.initialCondition?.condition.slice(1)}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Registrado: {loan.initialCondition?.recordedAt.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/teacher/return/${loan.id}`}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center"
                        >
                          <ArrowPathIcon className="h-5 w-5 mr-1" />
                          Registrar devolución
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