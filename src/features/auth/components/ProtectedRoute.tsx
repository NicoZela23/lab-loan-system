import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'teacher' | 'student' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Comprobar si el usuario está autenticado
    const checkAuth = () => {
      const userData = localStorage.getItem('labLoanUser');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setIsAuthenticated(user.isAuthenticated);
          setUserRole(user.role);
        } catch (error) {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };

    checkAuth();
  }, []);

  // Mientras verificamos la autenticación, no mostramos nada
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Si está autenticado y tiene el rol adecuado, mostrar el componente hijo
  return <>{children}</>;
}