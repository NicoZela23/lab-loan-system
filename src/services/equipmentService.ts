import { Equipment, DamageReport } from '../types/equipment';
import { DamageReportData } from '../features/equipment/components/DamageReportForm';

// Servicio para manejar operaciones de equipos
export class EquipmentService {
  private static instance: EquipmentService;
  private baseUrl = '/api/equipment'; // URL base para el backend

  static getInstance(): EquipmentService {
    if (!EquipmentService.instance) {
      EquipmentService.instance = new EquipmentService();
    }
    return EquipmentService.instance;
  }

  // Obtener todos los equipos
  async getAllEquipments(): Promise<Equipment[]> {
    try {
      // Por ahora retorna datos mock, más adelante se conectará al backend
      return this.getMockEquipments();
    } catch (error) {
      console.error('Error fetching equipments:', error);
      throw new Error('No se pudieron cargar los equipos');
    }
  }

  // Reportar daño en un equipo
  async reportDamage(equipmentId: number, damageData: DamageReportData): Promise<DamageReport> {
    try {
      // Simular llamada al backend
      const damageReport: DamageReport = {
        id: Date.now(),
        equipmentId,
        damageType: damageData.damageType,
        severity: damageData.severity,
        description: damageData.description,
        imageUrls: damageData.imageUrls,
        estimatedRepairTime: damageData.estimatedRepairTime,
        repairCost: damageData.repairCost,
        repairNotes: damageData.repairNotes,
        reportedBy: {
          id: 'admin-1',
          name: 'Administrador',
          role: 'admin'
        },
        reportedAt: new Date(),
        isResolved: false
      };

      // En el futuro, aquí iría la llamada real al backend:
      // const response = await fetch(`${this.baseUrl}/${equipmentId}/damage`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   },
      //   body: JSON.stringify(damageData)
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error al reportar el daño');
      // }
      // 
      // return await response.json();

      return damageReport;
    } catch (error) {
      console.error('Error reporting damage:', error);
      throw new Error('No se pudo reportar el daño del equipo');
    }
  }

  // Marcar equipo como reparado
  async markAsRepaired(equipmentId: number, repairNotes?: string): Promise<void> {
    try {
      // En el futuro, aquí iría la llamada real al backend:
      // const response = await fetch(`${this.baseUrl}/${equipmentId}/repair`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   },
      //   body: JSON.stringify({ repairNotes })
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error al marcar como reparado');
      // }

      console.log(`Equipment ${equipmentId} marked as repaired`, repairNotes ? `with notes: ${repairNotes}` : '');
    } catch (error) {
      console.error('Error marking equipment as repaired:', error);
      throw new Error('No se pudo marcar el equipo como reparado');
    }
  }

  // Cambiar estado de un equipo
  async updateEquipmentStatus(equipmentId: number, status: Equipment['status']): Promise<void> {
    try {
      // En el futuro, aquí iría la llamada real al backend:
      // const response = await fetch(`${this.baseUrl}/${equipmentId}/status`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   },
      //   body: JSON.stringify({ status })
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Error al actualizar el estado');
      // }

      console.log(`Equipment ${equipmentId} status updated to ${status}`);
    } catch (error) {
      console.error('Error updating equipment status:', error);
      throw new Error('No se pudo actualizar el estado del equipo');
    }
  }

  // Obtener historial de daños de un equipo
  async getDamageHistory(equipmentId: number): Promise<DamageReport[]> {
    try {
      // En el futuro, aquí iría la llamada real al backend:
      // const response = await fetch(`${this.baseUrl}/${equipmentId}/damage-history`);
      // 
      // if (!response.ok) {
      //   throw new Error('Error al cargar el historial de daños');
      // }
      // 
      // return await response.json();

      console.log(`Fetching damage history for equipment ${equipmentId}`);
      return []; // Por ahora retorna array vacío
    } catch (error) {
      console.error('Error fetching damage history:', error);
      throw new Error('No se pudo cargar el historial de daños');
    }
  }

  // Datos mock para desarrollo
  private getMockEquipments(): Equipment[] {
    return [
      {
        id: 1,
        name: 'Microscopio Digital',
        description: 'Microscopio digital de alta resolución con capacidad de aumento 40x-1000x',
        category: 'Óptica',
        status: 'disponible',
        location: 'Laboratorio A-201',
        serialNumber: 'MD-2024-001',
        isAvailableForLoan: true,
        imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400'
      },
      {
        id: 2,
        name: 'Balanza Analítica',
        description: 'Balanza de precisión para mediciones analíticas',
        category: 'Medición',
        status: 'disponible',
        location: 'Laboratorio B-105',
        serialNumber: 'BA-2024-002',
        isAvailableForLoan: true,
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'
      },
      {
        id: 3,
        name: 'Espectrofotómetro',
        description: 'Equipo para análisis espectroscópico',
        category: 'Análisis',
        status: 'dañado',
        location: 'Laboratorio C-301',
        serialNumber: 'ES-2024-003',
        isAvailableForLoan: false,
        imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400',
        currentDamageReport: {
          id: 1,
          equipmentId: 3,
          damageType: 'funcional',
          severity: 'moderado',
          description: 'El equipo no enciende correctamente y presenta errores en la pantalla',
          imageUrls: [],
          reportedBy: {
            id: 'admin-1',
            name: 'Administrador',
            role: 'admin'
          },
          reportedAt: new Date('2024-05-20'),
          isResolved: false
        }
      }
    ];
  }
}

// Exportar instancia singleton
export const equipmentService = EquipmentService.getInstance();