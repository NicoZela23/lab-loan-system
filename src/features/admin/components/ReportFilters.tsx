import { useState, useEffect } from 'react';
import { ReportFilters } from '../../../types/reports';
import { reportsService } from '../../../services/reportsService';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface ReportFiltersProps {
  onFiltersChange: (filters: ReportFilters) => void;
  loading?: boolean;
}

export default function ReportFiltersComponent({ onFiltersChange, loading }: ReportFiltersProps) {
  const [filters, setFilters] = useState<ReportFilters>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    includeReturned: true,
    includeActive: true
  });

  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableFaculties, setAvailableFaculties] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [years, faculties, categories] = await Promise.all([
        reportsService.getAvailableYears(),
        reportsService.getAvailableFaculties(),
        reportsService.getAvailableCategories()
      ]);
      
      setAvailableYears(years);
      setAvailableFaculties(faculties);
      setAvailableCategories(categories);
    } catch (error) {
      console.error('Error cargando opciones de filtros:', error);
    }
  };

  const handleFilterChange = (field: keyof ReportFilters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FunnelIcon className="h-5 w-5 text-primary-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Filtros de Reporte
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mes */}
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mes
          </label>
          <select
            id="month"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filters.month}
            onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}
            disabled={loading}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Año */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Año
          </label>
          <select
            id="year"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
            disabled={loading}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Facultad */}
        <div>
          <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Facultad (Opcional)
          </label>
          <select
            id="faculty"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filters.faculty || ''}
            onChange={(e) => handleFilterChange('faculty', e.target.value || undefined)}
            disabled={loading}
          >
            <option value="">Todas las facultades</option>
            {availableFaculties.map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categoría (Opcional)
          </label>
          <select
            id="category"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
            disabled={loading}
          >
            <option value="">Todas las categorías</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Opciones adicionales */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Incluir en el reporte:
        </h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <input
              id="includeReturned"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={filters.includeReturned}
              onChange={(e) => handleFilterChange('includeReturned', e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="includeReturned" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Préstamos devueltos
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="includeActive"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={filters.includeActive}
              onChange={(e) => handleFilterChange('includeActive', e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="includeActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Préstamos activos
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}