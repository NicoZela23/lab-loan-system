import { useState } from 'react';

interface HistoryFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function HistoryFilter({ onFilterChange }: HistoryFilterProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [status, setStatus] = useState('all');
  const [course, setCourse] = useState('');

  // Manejar cambios en los filtros
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    
    onFilterChange({
      dateRange: {
        start: type === 'start' ? value : startDate,
        end: type === 'end' ? value : endDate
      }
    });
  };

  const handleEquipmentIdChange = (value: string) => {
    setEquipmentId(value);
    onFilterChange({ equipmentId: value });
  };

  const handleStudentIdChange = (value: string) => {
    setStudentId(value);
    onFilterChange({ studentId: value });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ status: value });
  };

  const handleCourseChange = (value: string) => {
    setCourse(value);
    onFilterChange({ course: value });
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setEquipmentId('');
    setStudentId('');
    setStatus('all');
    setCourse('');

    onFilterChange({
      dateRange: { start: '', end: '' },
      equipmentId: '',
      studentId: '',
      status: 'all',
      course: ''
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filtros</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Filtro por rango de fechas */}
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha Inicio
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha Fin
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Filtro por equipo */}
        <div>
          <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Equipo (ID o nombre)
          </label>
          <input
            type="text"
            id="equipment"
            value={equipmentId}
            onChange={(e) => handleEquipmentIdChange(e.target.value)}
            placeholder="Buscar por equipo..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Filtro por estudiante */}
        <div>
          <label htmlFor="student" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estudiante (ID o nombre)
          </label>
          <input
            type="text"
            id="student"
            value={studentId}
            onChange={(e) => handleStudentIdChange(e.target.value)}
            placeholder="Buscar por estudiante..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Filtro por curso */}
        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Curso o asignatura
          </label>
          <input
            type="text"
            id="course"
            value={course}
            onChange={(e) => handleCourseChange(e.target.value)}
            placeholder="Filtrar por curso..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Filtro por estado */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estado
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">Todos</option>
            <option value="checked-out">Prestado</option>
            <option value="returned">Devuelto</option>
            <option value="returned-late">Devuelto con retraso</option>
            <option value="overdue">Vencido</option>
            <option value="lost">Extraviado</option>
            <option value="damaged">Dañado</option>
          </select>
        </div>
      </div>

      {/* Botón de reseteo */}
      <div className="flex justify-end mt-4">
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}