import { useState, useEffect } from 'react';
import HistoryFilter from '../components/HistoryFilter';
import HistoryTable from '../components/HistoryTable';
import { LoanHistoryItem } from '../types/historyTypes';

// Datos simulados para el historial de préstamos
const mockHistoryData: LoanHistoryItem[] = [
  {
    id: '1',
    equipmentName: 'Microscopio Digital',
    equipmentId: 'EQ001',
    studentName: 'Juan Pérez',
    studentId: 'A12345',
    checkoutDate: '2025-04-15',
    returnDate: '2025-04-20',
    actualReturnDate: '2025-04-20',
    course: 'Biología Celular',
    status: 'returned',
    condition: 'good',
    notes: 'Devuelto en perfecto estado'
  },
  {
    id: '2',
    equipmentName: 'Espectrofotómetro',
    equipmentId: 'EQ032',
    studentName: 'María García',
    studentId: 'A67890',
    checkoutDate: '2025-04-18',
    returnDate: '2025-04-25',
    actualReturnDate: '2025-04-26',
    course: 'Química Analítica',
    status: 'returned-late',
    condition: 'damaged',
    notes: 'Devuelto con rayones en la pantalla'
  },
  {
    id: '3',
    equipmentName: 'Kit de Electrónica',
    equipmentId: 'EQ078',
    studentName: 'Carlos Rodríguez',
    studentId: 'A24680',
    checkoutDate: '2025-05-10',
    returnDate: '2025-05-20',
    actualReturnDate: null,
    course: 'Electrónica Básica',
    status: 'checked-out',
    condition: null,
    notes: null
  },
  {
    id: '4',
    equipmentName: 'Analizador de Espectro',
    equipmentId: 'EQ099',
    studentName: 'Laura Martínez',
    studentId: 'A13579',
    checkoutDate: '2025-05-12',
    returnDate: '2025-05-15',
    actualReturnDate: null,
    course: 'Comunicaciones',
    status: 'overdue',
    condition: null,
    notes: null
  },
  {
    id: '5',
    equipmentName: 'Osciloscopio Digital',
    equipmentId: 'EQ042',
    studentName: 'Pedro Sánchez',
    studentId: 'A45678',
    checkoutDate: '2025-04-05',
    returnDate: '2025-04-10',
    actualReturnDate: '2025-04-09',
    course: 'Señales y Sistemas',
    status: 'returned',
    condition: 'excellent',
    notes: 'Devuelto anticipadamente en excelente estado'
  }
];

export default function LoanHistoryPage() {
  const [historyData, setHistoryData] = useState<LoanHistoryItem[]>(mockHistoryData);
  const [filteredData, setFilteredData] = useState<LoanHistoryItem[]>(mockHistoryData);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    equipmentId: '',
    studentId: '',
    status: 'all',
    course: ''
  });

  // Esta función se reemplazaría por una llamada a la API real
  const fetchHistoryData = () => {
    // Aquí iría la llamada al backend para obtener los datos reales
    // Por ahora usamos los datos simulados
    setHistoryData(mockHistoryData);
    applyFilters(mockHistoryData, filters);
  };

  // Carga inicial de datos
  useEffect(() => {
    fetchHistoryData();
  }, []);

  // Aplicar filtros a los datos
  const applyFilters = (data: LoanHistoryItem[], currentFilters: any) => {
    let result = [...data];

    // Filtrar por ID de equipo
    if (currentFilters.equipmentId) {
      result = result.filter(item => 
        item.equipmentId.toLowerCase().includes(currentFilters.equipmentId.toLowerCase()) ||
        item.equipmentName.toLowerCase().includes(currentFilters.equipmentId.toLowerCase())
      );
    }

    // Filtrar por ID de estudiante
    if (currentFilters.studentId) {
      result = result.filter(item => 
        item.studentId.toLowerCase().includes(currentFilters.studentId.toLowerCase()) ||
        item.studentName.toLowerCase().includes(currentFilters.studentId.toLowerCase())
      );
    }

    // Filtrar por curso
    if (currentFilters.course) {
      result = result.filter(item => 
        item.course.toLowerCase().includes(currentFilters.course.toLowerCase())
      );
    }

    // Filtrar por estado
    if (currentFilters.status !== 'all') {
      result = result.filter(item => item.status === currentFilters.status);
    }

    // Filtrar por rango de fechas
    if (currentFilters.dateRange.start && currentFilters.dateRange.end) {
      const startDate = new Date(currentFilters.dateRange.start);
      const endDate = new Date(currentFilters.dateRange.end);
      
      result = result.filter(item => {
        const checkoutDate = new Date(item.checkoutDate);
        return checkoutDate >= startDate && checkoutDate <= endDate;
      });
    }

    setFilteredData(result);
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters: any) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    applyFilters(historyData, updatedFilters);
  };

  // Exportar datos a CSV
  const exportToCSV = () => {
    // Implementación simple de exportación a CSV
    const headers = ['ID', 'Equipo', 'ID Equipo', 'Estudiante', 'ID Estudiante', 'Fecha Préstamo', 'Fecha Devolución Prevista', 'Fecha Devolución Real', 'Curso', 'Estado', 'Condición', 'Notas'];
    
    const csvRows = [
      headers.join(','),
      ...filteredData.map(item => [
        item.id,
        `"${item.equipmentName}"`,
        item.equipmentId,
        `"${item.studentName}"`,
        item.studentId,
        item.checkoutDate,
        item.returnDate,
        item.actualReturnDate || '',
        `"${item.course}"`,
        item.status,
        item.condition || '',
        item.notes ? `"${item.notes}"` : ''
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `historial_prestamos_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6 px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Préstamos</h1>
        <button 
          onClick={exportToCSV}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Exportar a CSV
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 overflow-hidden">
        <HistoryFilter onFilterChange={handleFilterChange} />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <HistoryTable data={filteredData} />
      </div>
    </div>
  );
}