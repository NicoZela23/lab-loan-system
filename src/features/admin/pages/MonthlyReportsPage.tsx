import { useState } from 'react';
import { MonthlyUsageReport, ReportFilters, ReportExportOptions } from '../../../types/reports';
import { reportsService } from '../../../services/reportsService';
import ReportFiltersComponent from '../components/ReportFilters';
import ReportDisplay from '../components/ReportDisplay';
import { 
  DocumentArrowDownIcon, 
  ChartBarIcon, 
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function MonthlyReportsPage() {
  const [reportData, setReportData] = useState<MonthlyUsageReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleGenerateReport = async (filters: ReportFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const report = await reportsService.generateMonthlyReport(filters);
      setReportData(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generando el reporte');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (!reportData) return;
    
    setExporting(true);
    try {
      const exportOptions: ReportExportOptions = {
        format,
        includeCharts: true,
        includeDetails: true,
        language: 'es'
      };
      
      const blob = await reportsService.exportReport(reportData, exportOptions);
      
      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_mensual_${reportData.month}_${reportData.year}.${format}`;
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      setError('Error exportando el reporte');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Reportes Mensuales de Uso
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Genera reportes detallados sobre el uso de materiales y equipos de laboratorio
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-8 w-8 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <ReportFiltersComponent 
            onFiltersChange={handleGenerateReport}
            loading={loading}
          />
        </div>

        {/* Botón de generar reporte */}
        {!loading && !reportData && !error && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center mb-6">
            <ChartBarIcon className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
              Listo para generar reporte
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              Selecciona los filtros arriba y el reporte se generará automáticamente
            </p>
          </div>
        )}

        {/* Estado de carga */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center mb-6">
            <div className="flex flex-col items-center">
              <ArrowPathIcon className="h-12 w-12 text-primary-600 animate-spin mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Generando reporte...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Analizando datos y preparando estadísticas
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-900 dark:text-red-100">
                  Error al generar reporte
                </h3>
                <p className="text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reporte generado */}
        {reportData && (
          <>
            {/* Opciones de exportación */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Reporte Generado
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {reportData.month} {reportData.year} - {reportData.totalLoans} préstamos analizados
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExportReport('csv')}
                    disabled={exporting}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    CSV
                  </button>
                  <button
                    onClick={() => handleExportReport('excel')}
                    disabled={exporting}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    Excel
                  </button>
                  <button
                    onClick={() => handleExportReport('pdf')}
                    disabled={exporting}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Mostrar el reporte */}
            <ReportDisplay report={reportData} />
          </>
        )}
      </div>
    </div>
  );
}