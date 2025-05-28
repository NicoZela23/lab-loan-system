// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Tipos para 2FA
export interface TwoFactorRequest {
  email: string;
}

export interface TwoFactorVerifyRequest {
  email: string;
  code: string;
}

export interface TwoFactorResponse {
  success: boolean;
  data: {
    message: string;
    expiresIn?: number;
    emailSent?: string;
    verified?: boolean;
    email?: string;
  };
  message: string;
}

export interface EmailAuthResponse {
  success: boolean;
  data: {
    authorized: boolean;
    email: string;
  };
  message: string;
}

// Clase para manejar las peticiones HTTP
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Verificar si el email está autorizado para demo
  async checkEmailAuthorization(email: string): Promise<EmailAuthResponse> {
    return this.request<EmailAuthResponse>(`/auth/check-email-auth?email=${encodeURIComponent(email)}`);
  }

  // Enviar código 2FA por email
  async sendTwoFactorCode(data: TwoFactorRequest): Promise<TwoFactorResponse> {
    return this.request<TwoFactorResponse>('/auth/send-2fa-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Verificar código 2FA
  async verifyTwoFactorCode(data: TwoFactorVerifyRequest): Promise<TwoFactorResponse> {
    return this.request<TwoFactorResponse>('/auth/verify-2fa-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Instancia singleton
export const apiService = new ApiService();

// Funciones de utilidad específicas para 2FA
export const auth2FA = {
  checkEmail: (email: string) => apiService.checkEmailAuthorization(email),
  sendCode: (email: string) => apiService.sendTwoFactorCode({ email }),
  verifyCode: (email: string, code: string) => apiService.verifyTwoFactorCode({ email, code }),
};