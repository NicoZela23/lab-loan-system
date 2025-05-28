import { MonthlyUsageReport, ReportFilters, ReportExportOptions } from '../types/reports';

// Datos de ejemplo para demostración
const generateMockReportData = (filters: ReportFilters): MonthlyUsageReport => {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return {
    month: monthNames[filters.month - 1],
    year: filters.year,
    totalLoans: 156,
    uniqueUsers: 89,
    equipmentUsage: [
      {
        equipmentId: 'EQ001',
        equipmentName: 'Microscopio Digital',
        category: 'Óptica',
        totalLoans: 24,
        totalHours: 180,
        averageUsageTime: 7.5,
        mostActiveUser: 'Juan Pérez',
        condition: {
          excellent: 18,
          good: 4,
          regular: 2,
          damaged: 0
        }
      },
      {
        equipmentId: 'EQ002',
        equipmentName: 'Espectrofotómetro',
        category: 'Análisis',
        totalLoans: 19,
        totalHours: 152,
        averageUsageTime: 8.0,
        mostActiveUser: 'María García',
        condition: {
          excellent: 15,
          good: 3,
          regular: 1,
          damaged: 0
        }
      },
      {
        equipmentId: 'EQ003',
        equipmentName: 'Balanza Analítica',
        category: 'Medición',
        totalLoans: 32,
        totalHours: 96,
        averageUsageTime: 3.0,
        mostActiveUser: 'Carlos López',
        condition: {
          excellent: 28,
          good: 3,
          regular: 1,
          damaged: 0
        }
      }
    ],
    categoryUsage: [
      {
        category: 'Óptica',
        totalLoans: 45,
        totalHours: 360,
        equipmentCount: 8,
        popularEquipment: 'Microscopio Digital'
      },
      {
        category: 'Análisis',
        totalLoans: 38,
        totalHours: 304,
        equipmentCount: 6,
        popularEquipment: 'Espectrofotómetro'
      },
      {
        category: 'Medición',
        totalLoans: 73,
        totalHours: 219,
        equipmentCount: 12,
        popularEquipment: 'Balanza Analítica'
      }
    ],
    facultyUsage: [
      {
        faculty: 'Ingeniería',
        totalLoans: 67,
        totalStudents: 34,
        mostUsedEquipment: 'Microscopio Digital',
        averageUsageTime: 6.8
      },
      {
        faculty: 'Ciencias',
        totalLoans: 52,
        totalStudents: 28,
        mostUsedEquipment: 'Espectrofotómetro',
        averageUsageTime: 7.2
      },
      {
        faculty: 'Medicina',
        totalLoans: 37,
        totalStudents: 27,
        mostUsedEquipment: 'Balanza Analítica',
        averageUsageTime: 4.5
      }
    ],
    summary: {
      mostUsedEquipment: 'Balanza Analítica',
      leastUsedEquipment: 'Centrifuga',
      peakUsageDay: 'Miércoles',
      averageLoanDuration: 5.8,
      onTimeReturns: 142,
      lateReturns: 14,
      damageIncidents: 2,
      recommendations: [
        'Considerar adquirir una segunda balanza analítica debido a la alta demanda',
        'Programar mantenimiento preventivo para el espectrofotómetro',
        'Implementar talleres de uso correcto para reducir daños en equipos'
      ]
    }
  };
};

class ReportsService {
  // Generar reporte mensual
  async generateMonthlyReport(filters: ReportFilters): Promise<MonthlyUsageReport> {
    try {
      // En producción, esto sería una llamada al backend:
      // const response = await fetch('/api/reports/monthly', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(filters)
      // });
      // return await response.json();

      // Simulamos delay de red
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return generateMockReportData(filters);
    } catch (error) {
      console.error('Error generando reporte mensual:', error);
      throw new Error('No se pudo generar el reporte mensual');
    }
  }

  // Exportar reporte
  async exportReport(reportData: MonthlyUsageReport, options: ReportExportOptions): Promise<Blob> {
    try {
      // En producción, esto sería una llamada al backend para generar el archivo
      // const response = await fetch('/api/reports/export', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reportData, options })
      // });
      // return await response.blob();

      // Para demostración, generamos un archivo CSV básico
      if (options.format === 'csv') {
        const csvContent = this.generateCSV(reportData);
        return new Blob([csvContent], { type: 'text/csv' });
      }

      // Para otros formatos, retornamos un placeholder
      const content = `Reporte ${reportData.month} ${reportData.year} - ${options.format.toUpperCase()}`;
      return new Blob([content], { type: 'application/octet-stream' });
    } catch (error) {
      console.error('Error exportando reporte:', error);
      throw new Error('No se pudo exportar el reporte');
    }
  }

  // Generar contenido CSV
  private generateCSV(reportData: MonthlyUsageReport): string {
    let csv = `Reporte Mensual de Uso de Materiales\n`;
    csv += `Mes: ${reportData.month} ${reportData.year}\n\n`;
    
    csv += `Resumen General\n`;
    csv += `Total de Préstamos,${reportData.totalLoans}\n`;
    csv += `Usuarios Únicos,${reportData.uniqueUsers}\n\n`;
    
    csv += `Uso por Equipo\n`;
    csv += `ID Equipo,Nombre,Categoría,Préstamos,Horas Totales,Promedio Horas\n`;
    reportData.equipmentUsage.forEach(eq => {
      csv += `${eq.equipmentId},${eq.equipmentName},${eq.category},${eq.totalLoans},${eq.totalHours},${eq.averageUsageTime}\n`;
    });
    
    csv += `\nUso por Categoría\n`;
    csv += `Categoría,Préstamos,Horas Totales,Equipos,Equipo Popular\n`;
    reportData.categoryUsage.forEach(cat => {
      csv += `${cat.category},${cat.totalLoans},${cat.totalHours},${cat.equipmentCount},${cat.popularEquipment}\n`;
    });
    
    return csv;
  }

  // Obtener años disponibles para reportes
  async getAvailableYears(): Promise<number[]> {
    // En producción esto vendría del backend
    const currentYear = new Date().getFullYear();
    return [currentYear - 2, currentYear - 1, currentYear];
  }

  // Obtener facultades disponibles
  async getAvailableFaculties(): Promise<string[]> {
    // En producción esto vendría del backend
    return ['Ingeniería', 'Ciencias', 'Medicina', 'Arquitectura', 'Administración'];
  }

  // Obtener categorías de equipos
  async getAvailableCategories(): Promise<string[]> {
    // En producción esto vendría del backend
    return ['Óptica', 'Análisis', 'Medición', 'Electrónica', 'Mecánica'];
  }
}

export const reportsService = new ReportsService();