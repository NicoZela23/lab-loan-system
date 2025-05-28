import { Outlet } from 'react-router-dom';
import TeacherNavigation from '../components/TeacherNavigation';

export default function TeacherLayout() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen overflow-x-hidden">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Barra lateral de navegación */}
          <div className="md:w-72 flex-shrink-0">
            <TeacherNavigation />
          </div>
          
          {/* Contenido principal con control de desbordamiento */}
          <div className="flex-1 min-w-0 overflow-x-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}