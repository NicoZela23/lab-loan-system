import { User, SuspensionData } from '../types/user';

// Datos de ejemplo hasta que se implemente el backend
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@universidad.edu',
    role: 'estudiante',
    studentId: '2020123456',
    faculty: 'Ingeniería',
    program: 'Ingeniería Química',
    isSuspended: false,
    createdAt: new Date('2023-08-15')
  },
  {
    id: '2',
    name: 'María López',
    email: 'maria.lopez@universidad.edu',
    role: 'estudiante',
    studentId: '2019234567',
    faculty: 'Ciencias',
    program: 'Química',
    isSuspended: true,
    suspensionReason: 'Daño de material de laboratorio - Microscopio avanzado',
    suspendedAt: new Date('2023-11-20'),
    suspendedBy: 'Admin Sistema',
    createdAt: new Date('2023-01-10')
  },
  {
    id: '3',
    name: 'Dr. Carlos Rodríguez',
    email: 'carlos.rodriguez@universidad.edu',
    role: 'docente',
    faculty: 'Medicina',
    program: 'Departamento de Bioquímica',
    isSuspended: false,
    createdAt: new Date('2022-09-01')
  },
  {
    id: '4',
    name: 'Lucía Martínez',
    email: 'lucia.martinez@universidad.edu',
    role: 'administrador',
    isSuspended: false,
    createdAt: new Date('2022-05-15')
  }
];

// Servicio para manejar usuarios
export const userService = {
  // Obtener todos los usuarios
  getUsers: async (): Promise<User[]> => {
    // Simulamos una llamada a la API con un pequeño delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers);
      }, 300);
    });
  },

  // Obtener un usuario por ID
  getUserById: async (id: string): Promise<User | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(user => user.id === id);
        resolve(user);
      }, 200);
    });
  },

  // Suspender a un usuario
  suspendUser: async (suspensionData: SuspensionData): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = mockUsers.findIndex(user => user.id === suspensionData.userId);
        
        if (userIndex === -1) {
          reject(new Error('Usuario no encontrado'));
          return;
        }

        // Clonar el usuario y actualizar sus datos de suspensión
        const updatedUser = { 
          ...mockUsers[userIndex],
          isSuspended: true,
          suspensionReason: suspensionData.reason,
          suspendedAt: new Date(),
          suspendedBy: 'Admin Sistema' // En un sistema real, esto vendría del usuario autenticado
        };

        // Actualizar el usuario en el array
        mockUsers[userIndex] = updatedUser;
        resolve(updatedUser);
      }, 500);
    });
  },

  // Reactivar a un usuario
  reactivateUser: async (userId: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = mockUsers.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
          reject(new Error('Usuario no encontrado'));
          return;
        }

        // Clonar el usuario y quitar datos de suspensión
        const updatedUser = { 
          ...mockUsers[userIndex],
          isSuspended: false,
          suspensionReason: undefined,
          suspendedAt: undefined,
          suspendedBy: undefined
        };

        // Actualizar el usuario en el array
        mockUsers[userIndex] = updatedUser;
        resolve(updatedUser);
      }, 500);
    });
  }
};