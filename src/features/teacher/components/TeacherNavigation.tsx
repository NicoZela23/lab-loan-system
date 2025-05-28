import { Link, useLocation } from 'react-router-dom';
import { 
  ClipboardDocumentCheckIcon, 
  ArrowPathIcon, 
  BookOpenIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

// Ítems de navegación para el panel de docentes
const navItems = [
  {
    name: 'Préstamos Pendientes',
    description: 'Préstamos aprobados pendientes de entrega',
    path: '/teacher/pending-loans',
    icon: ClipboardDocumentCheckIcon
  },
  {
    name: 'Préstamos Activos',
    description: 'Equipos actualmente prestados',
    path: '/teacher/active-loans',
    icon: ClockIcon
  },
  {
    name: 'Historial de Préstamos',
    description: 'Registro histórico de equipos prestados',
    path: '/teacher/loan-history',
    icon: ArchiveBoxIcon
  },
  {
    name: 'Solicitudes de Reserva',
    description: 'Solicitudes pendientes de aprobación',
    path: '/teacher/reservation-requests',
    icon: BookOpenIcon
  }
];

export default function TeacherNavigation() {
  const location = useLocation();
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
          Panel de Docente
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Gestiona préstamos, reservas y estado de equipos
        </p>
      </div>
      
      <div className="py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
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
            to="/teacher/pending-loans"
            className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1" />
            Entregar equipo
          </Link>
          <Link
            to="/teacher/active-loans"
            className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-primary-600 dark:hover:text-primary-400"
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Registrar devolución
          </Link>
        </div>
      </div>
    </nav>
  );
}