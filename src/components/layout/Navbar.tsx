import { BeakerIcon, CalendarDaysIcon, ExclamationTriangleIcon, ArrowUturnLeftIcon, CheckBadgeIcon, ClockIcon, UserGroupIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface User {
  isAuthenticated: boolean;
  role: 'student' | 'teacher' | 'admin';
  name: string;
  email: string;
}

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('labLoanUser');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  
  // Función para determinar si un enlace está activo
  const isActive = (path: string) => {
    return location.pathname === path;
  };  // Función para obtener los enlaces según el rol
  const getNavigationLinks = () => {
    if (!user) return [];

    switch (user.role) {      case 'student':
        return [
          { path: '/student/materials', label: 'Materiales', icon: Squares2X2Icon },
          { path: '/student/reservations', label: 'Mis Reservas', icon: CalendarDaysIcon },
          { path: '/student/loans', label: 'Mis Préstamos', icon: ArrowUturnLeftIcon },
          { path: '/student/history', label: 'Mi Historial', icon: ClockIcon }
        ];
      case 'teacher':
        return [
          { path: '/teacher/pending-loans', label: 'Préstamos Pendientes', icon: CalendarDaysIcon },
          { path: '/teacher/active-loans', label: 'Préstamos Activos', icon: CheckBadgeIcon },
          { path: '/teacher/loan-history', label: 'Historial', icon: ClockIcon },
          { path: '/teacher/reservation-requests', label: 'Aprobaciones', icon: CheckBadgeIcon }
        ];
      case 'admin':
        return [
          { path: '/equipment', label: 'Inventario', icon: Squares2X2Icon },
          { path: '/reservas', label: 'Reservas', icon: CalendarDaysIcon },
          { path: '/devoluciones', label: 'Devoluciones', icon: ArrowUturnLeftIcon },
          { path: '/incidencias', label: 'Incidencias', icon: ExclamationTriangleIcon },
          { path: '/aprobaciones', label: 'Aprobaciones', icon: CheckBadgeIcon },
          { path: '/historial', label: 'Historial', icon: ClockIcon },
          { path: '/usuarios', label: 'Usuarios', icon: UserGroupIcon }
        ];
      default:
        return [];
    }
  };

  const navigationLinks = getNavigationLinks();

  const handleLogout = () => {
    localStorage.removeItem('labLoanUser');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BeakerIcon className="h-8 w-8 mr-2" />
            <span className="text-xl font-semibold">Sistema de Préstamos de Laboratorio</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Enlaces de navegación */}
            <div className="flex items-center space-x-1">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                      isActive(link.path) 
                        ? 'bg-primary-800 text-white' 
                        : 'text-primary-100 hover:bg-primary-600 hover:text-white'
                    } focus:outline-none focus:ring-2 focus:ring-white transition-colors`}
                  >
                    <IconComponent className="h-4 w-4 mr-1" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Información del usuario y logout */}
            {user && (
              <div className="flex items-center space-x-4 border-l border-primary-600 pl-4">
                <div className="text-sm">
                  <div className="text-primary-100">{user.name}</div>
                  <div className="text-primary-300 text-xs capitalize">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-primary-100 hover:text-white hover:bg-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
