// Типы для авторизации и сессий

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  position?: string;
  workplace?: string;
  department?: string;
  subjects?: string[];
  academicDegree?: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresAt: string;
  message: string;
}

export interface UserIdentity {
  sessionKey: string;
  userId: string;
} 