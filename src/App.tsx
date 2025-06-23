import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import EquipmentPage from './features/equipment/pages/EquipmentPage';
import StudentEquipmentPage from './features/equipment/pages/StudentEquipmentPage';
import StudentReservationsPage from './features/reservations/pages/StudentReservationsPage';
import StudentLoansPage from './features/returns/pages/StudentLoansPage';
import ReservationPage from './features/reservations/pages/ReservationPage';
import IncidentPage from './features/incidents/pages/IncidentPage';
import ReturnPage from './features/returns/pages/ReturnPage';
import ApprovalPage from './features/teacher/pages/ApprovalPage';
import LoanHistoryPage from './features/history/pages/LoanHistoryPage';
import UsersPage from './features/admin/pages/UsersPage';
import LoginPage from './features/auth/pages/LoginPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import TeacherLayout from './features/teacher/layout/TeacherLayout';
import AdminLayout from './features/admin/layout/AdminLayout';
import PendingReservationsPage from './features/teacher/pages/PendingReservationsPage';
import ActiveLoansPage from './features/teacher/pages/ActiveLoansPage';
import ReturnRegistrationPage from './features/teacher/pages/ReturnRegistrationPage';
import LoanInitialConditionPage from './features/teacher/components/LoanInitialConditionPage';
import usePageTitle from './hooks/usePageTitle';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import PenaltySettingsPage from './features/admin/pages/PenaltySettingsPage';
import ActivePenaltiesPage from './features/admin/pages/ActivePenaltiesPage';
import MonthlyReportsPage from './features/admin/pages/MonthlyReportsPage';
import TwoFactorSettingsPage from './features/admin/pages/TwoFactorSettingsPage';
import './App.css';

function App() {
  // Hook para manejar títulos dinámicos de páginas
  usePageTitle();

  return (
    <Routes>
      {/* Ruta pública: Login */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Ruta por defecto: redirige a login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Rutas protegidas generales dentro del Layout principal */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="equipment" element={<EquipmentPage />} />
        <Route path="reservas" element={<ReservationPage />} />
        <Route path="incidencias" element={<IncidentPage />} />
        <Route path="devoluciones" element={<ReturnPage />} />
        <Route path="aprobaciones" element={<ApprovalPage />} />
        <Route path="historial" element={<LoanHistoryPage />} />
        <Route path="usuarios" element={<UsersPage />} />
      </Route>      {/* Rutas específicas para estudiantes */}
      <Route path="/student" element={
        <ProtectedRoute requiredRole="student">
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/student/materials" replace />} />
        <Route path="materials" element={<StudentEquipmentPage />} />
        <Route path="reservations" element={<StudentReservationsPage />} />
        <Route path="loans" element={<StudentLoansPage />} />
        <Route path="history" element={<LoanHistoryPage />} />
      </Route>
      
      {/* Rutas específicas para docentes */}
      <Route path="/teacher" element={
        <ProtectedRoute requiredRole="teacher">
          <TeacherLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/teacher/pending-loans" replace />} />
        <Route path="pending-loans" element={<PendingReservationsPage />} />
        <Route path="active-loans" element={<ActiveLoansPage />} />
        <Route path="loan-history" element={<LoanHistoryPage />} />
        <Route path="reservation-requests" element={<ApprovalPage />} />
      </Route>
      
      {/* Rutas individuales para procesos específicos de docentes */}
      <Route path="/teacher/loan-condition/:reservationId" element={
        <ProtectedRoute requiredRole="teacher">
          <LoanInitialConditionPage />
        </ProtectedRoute>
      } />
      
      <Route path="/teacher/return/:reservationId" element={
        <ProtectedRoute requiredRole="teacher">
          <ReturnRegistrationPage />
        </ProtectedRoute>
      } />
      
      {/* Rutas para el administrador */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="equipment" element={<EquipmentPage />} />
        <Route path="2fa-settings" element={<TwoFactorSettingsPage />} />
        <Route path="monthly-reports" element={<MonthlyReportsPage />} />
        <Route path="penalties" element={<PenaltySettingsPage />} />
        <Route path="active-penalties" element={<ActivePenaltiesPage />} />
        <Route path="loan-history" element={<LoanHistoryPage />} />
      </Route>
      
      {/* Página de no autorizado */}
      <Route path="/unauthorized" element={<div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Acceso no autorizado</h1>
        <p className="mt-4">No tienes permiso para acceder a esta sección.</p>
      </div>} />
      
      {/* Página no encontrada */}
      <Route path="*" element={<div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Página no encontrada</h1>
        <p className="mt-4">La página que estás buscando no existe.</p>
      </div>} />
    </Routes>
  );
}

export default App;
