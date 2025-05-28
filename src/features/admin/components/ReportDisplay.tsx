import { MonthlyUsageReport } from '../../../types/reports';
import { 
  ChartBarIcon, 
  UsersIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

interface ReportDisplayProps {
  report: MonthlyUsageReport;
}

export default function ReportDisplay({ report }: ReportDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Encabezado del Reporte */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reporte Mensual de Uso de Materiales
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {report.month} {report.year}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <ChartBarIcon className="h-5 w-5" />
            <span>Generado el {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Préstamos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{report.totalLoans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Usuarios Únicos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{report.uniqueUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Devoluciones a Tiempo</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{report.summary.onTimeReturns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Devoluciones Tardías</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{report.summary.lateReturns}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipos Más Utilizados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Equipos Más Utilizados
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Equipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Préstamos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Horas Totales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Promedio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {report.equipmentUsage.map((equipment, index) => (
                <tr key={equipment.equipmentId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index < 3 && (
                        <TrophyIcon className={`h-5 w-5 mr-2 ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 
                          'text-amber-600'
                        }`} />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {equipment.equipmentName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {equipment.equipmentId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {equipment.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {equipment.totalLoans}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {equipment.totalHours}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {equipment.averageUsageTime.toFixed(1)}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        E: {equipment.condition.excellent}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        B: {equipment.condition.good}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                        R: {equipment.condition.regular}
                      </span>
                      {equipment.condition.damaged > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                          D: {equipment.condition.damaged}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Uso por Categoría */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Uso por Categoría
          </h3>
          <div className="space-y-4">
            {report.categoryUsage.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{category.category}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {category.equipmentCount} equipos disponibles
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.totalLoans}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {category.totalHours}h totales
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Uso por Facultad */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Uso por Facultad
          </h3>
          <div className="space-y-4">
            {report.facultyUsage.map((faculty) => (
              <div key={faculty.faculty} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{faculty.faculty}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {faculty.totalStudents} estudiantes activos
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {faculty.totalLoans}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {faculty.averageUsageTime.toFixed(1)}h promedio
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen y Recomendaciones */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Resumen Ejecutivo y Recomendaciones
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Estadísticas Clave</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Equipo más utilizado: <span className="font-medium">{report.summary.mostUsedEquipment}</span></li>
              <li>• Equipo menos utilizado: <span className="font-medium">{report.summary.leastUsedEquipment}</span></li>
              <li>• Día de mayor uso: <span className="font-medium">{report.summary.peakUsageDay}</span></li>
              <li>• Duración promedio de préstamo: <span className="font-medium">{report.summary.averageLoanDuration} días</span></li>
              <li>• Incidentes de daño: <span className="font-medium">{report.summary.damageIncidents}</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recomendaciones</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {report.summary.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}