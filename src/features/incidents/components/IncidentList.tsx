// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\features\incidents\components\IncidentList.tsx
import { Incident, IncidentStatus } from '../../../types/incident';

interface IncidentListProps {
  incidents: Incident[];
  onViewIncident?: (incident: Incident) => void;
}

export default function IncidentList({ incidents, onViewIncident }: IncidentListProps) {
  const getStatusBadgeClass = (status: IncidentStatus) => {
    const baseClass = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
    
    switch (status) {
      case 'reportada':
        return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`;
      case 'en revisión':
        return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`;
      case 'resuelta':
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      case 'rechazada':
        return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
      default:
        return baseClass;
    }
  };

  const getSeverityClass = (severity: string) => {
    const baseClass = "px-2 py-0.5 text-xs font-medium rounded";
    
    switch (severity) {
      case 'baja':
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      case 'media':
        return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`;
      case 'alta':
        return `${baseClass} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300`;
      case 'crítica':
        return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`;
      default:
        return baseClass;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!incidents.length) {
    return (
      <div className="text-center py-10 bg-white/10 dark:bg-gray-800/40 rounded-lg shadow-inner">
        <p className="text-gray-300 dark:text-gray-400">No has reportado ninguna incidencia.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Incidencia
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Equipo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Severidad
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              {onViewIncident && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {incidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{incident.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">{incident.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{incident.equipment?.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getSeverityClass(incident.severity)}>
                    {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(incident.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadgeClass(incident.status)}>
                    {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  </span>
                </td>
                {onViewIncident && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onViewIncident(incident)} 
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Ver detalles
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}