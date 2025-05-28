import { BeakerIcon, CalendarDaysIcon, ExclamationTriangleIcon, ArrowUturnLeftIcon, CheckBadgeIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  // Función para determinar si un enlace está activo
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BeakerIcon className="h-8 w-8 mr-2" />
            <span className="text-xl font-semibold">Sistema de Préstamos de Laboratorio</span>
          </div>
          <div>
            <Link 
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'bg-primary-800 text-white' 
                  : 'text-primary-100 hover:bg-primary-600 hover:text-white'
              } focus:outline-none focus:ring-2 focus:ring-white`}
            >
              Inventario
            </Link>
            <Link 
              to="/reservas"
              className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/reservas') 
                  ? 'bg-primary-800 text-white' 
                  : 'text-primary-100 hover:bg-primary-600 hover:text-white'
              } focus:outline-none focus:ring-2 focus:ring-white flex items-center inline-flex`}
            >
              <CalendarDaysIcon className="h-5 w-5 mr-1" />
              Reservas
            </Link>
            <Link 
              to="/devoluciones"
              className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/devoluciones') 
                  ? 'bg-primary-800 text-white' 
                  : 'text-primary-100 hover:bg-primary-600 hover:text-white'
              } focus:outline-none focus:ring-2 focus:ring-white flex items-center inline-flex`}
            >
              <ArrowUturnLeftIcon className="h-5 w-5 mr-1" />
              Devoluciones
            </Link>
            <Link 
              to="/incidencias"
              className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/incidencias') 
                  ? 'bg-primary-800 text-white' 
                  : 'text-primary-100 hover:bg-primary-600 hover:text-white'
              } focus:outline-none focus:ring-2 focus:ring-white flex items-center inline-flex`}
            >
              <ExclamationTriangleIcon className="h-5 w-5 mr-1" />
              Incidencias
            </Link>
            <Link 
              to="/aprobaciones"
              className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/aprobaciones') 
                  ? 'bg-primary-800 text-white' 
                  : 'text-primary-100 hover:bg-primary-600 hover:text-white'
              } focus:outline-none focus:ring-2 focus:ring-white flex items-center inline-flex`}
            >
              <CheckBadgeIcon className="h-5 w-5 mr-1" />
              Aprobaciones
            </Link>
            <Link 
              to="/historial"
              className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/historial') 
                  ? 'bg-primary-800 text-white' 
                  : 'text-primary-100 hover:bg-primary-600 hover:text-white'
              } focus:outline-none focus:ring-2 focus:ring-white flex items-center inline-flex`}
            >
              <ClockIcon className="h-5 w-5 mr-1" />
              Historial
            </Link>
            <Link 
              to="/usuarios"
              className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/usuarios') 
                  ? 'bg-primary-800 text-white' 
                  : 'text-primary-100 hover:bg-primary-600 hover:text-white'
              } focus:outline-none focus:ring-2 focus:ring-white flex items-center inline-flex`}
            >
              <UserGroupIcon className="h-5 w-5 mr-1" />
              Usuarios
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
