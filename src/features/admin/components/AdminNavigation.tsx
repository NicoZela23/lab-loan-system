import { Link, useLocation } from 'react-router-dom';
import {
  UsersIcon,
  ClockIcon,
  ShieldExclamationIcon,
  Cog6ToothIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

// Definición de las opciones de navegación
const navigationItems = [
  {
    name: 'Usuarios',
    description: 'Gestión de usuarios del sistema',
    path: '/admin/users',
    icon: UsersIcon
  },
  {
    name: 'Configuración de Sanciones',
    description: 'Configurar reglas para sanciones automáticas',
    path: '/admin/penalties',
    icon: Cog6ToothIcon
  },
  {
    name: 'Sanciones Activas',
    description: 'Ver y gestionar sanciones actuales',
    path: '/admin/active-penalties',
    icon: ShieldExclamationIcon
  },
  {
    name: 'Historial de Préstamos',
    description: 'Ver todos los préstamos y devoluciones',
    path: '/admin/loan-history',
    icon: ArchiveBoxIcon
  }
];

export default function AdminNavigation() {
  const location = useLocation();
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Panel de Administración</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Gestión de usuarios y configuración del sistema
        </p>
      </div>
      
      <div className="px-4 py-2">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-colors ${
                    isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className={`mr-4 flex-shrink-0 h-6 w-6 ${isActive ? 'text-primary-500 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-gray-200'}`}>
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="px-4 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Acciones rápidas
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            to="/admin/penalties"
            className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <Cog6ToothIcon className="h-4 w-4 mr-1" />
            Configurar sanciones
          </Link>
          <Link
            to="/admin/active-penalties"
            className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <ShieldExclamationIcon className="h-4 w-4 mr-1" />
            Ver sanciones activas
          </Link>
        </div>
      </div>
    </nav>
  );
}