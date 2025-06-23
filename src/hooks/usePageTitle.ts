import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTitleConfig {
  [key: string]: string;
}

const pageTitles: PageTitleConfig = {
  '/login': 'Iniciar Sesión',
  '/student/materials': 'Materiales Disponibles',
  '/student/reservations': 'Mis Reservas',
  '/student/loans': 'Mis Préstamos',
  '/student/history': 'Mi Historial',
  '/teacher/pending-loans': 'Préstamos Pendientes',
  '/teacher/active-loans': 'Préstamos Activos', 
  '/teacher/loan-history': 'Historial de Préstamos',
  '/teacher/reservation-requests': 'Solicitudes de Reserva',
  '/teacher/loan-condition': 'Estado del Préstamo',
  '/admin': 'Panel de Administración',
  '/admin/dashboard': 'Dashboard',
  '/equipment': 'Gestión de Inventario',
  '/reservas': 'Gestión de Reservas',
  '/incidencias': 'Gestión de Incidencias',
  '/devoluciones': 'Gestión de Devoluciones',
  '/aprobaciones': 'Aprobaciones',
  '/historial': 'Historial del Sistema',
  '/usuarios': 'Gestión de Usuarios'
};

export const usePageTitle = () => {
  const location = useLocation();
  
  useEffect(() => {
    const baseTitle = 'Lab Loan System';
    const currentPath = location.pathname;
    
    // Buscar título exacto o el más específico
    let pageTitle = pageTitles[currentPath];
    
    // Si no encuentra exacto, buscar parcial (para rutas dinámicas)
    if (!pageTitle) {
      const matchingKey = Object.keys(pageTitles).find(key => 
        currentPath.startsWith(key) && key !== '/'
      );
      pageTitle = matchingKey ? pageTitles[matchingKey] : '';
    }
    
    // Construir título final
    const fullTitle = pageTitle 
      ? `${pageTitle} | ${baseTitle}`
      : baseTitle;
      
    document.title = fullTitle;
  }, [location.pathname]);
};

export default usePageTitle;
