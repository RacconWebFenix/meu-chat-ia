// src/types/auth.types.ts
export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
}

export interface AuthSession {
  user: User;
  expires: string;
  accessToken?: string;
}

export interface TokenValidationResult {
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
}

export interface JWTPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
  jti?: string;
  iss?: string;
  aud?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  validateSession: () => Promise<boolean>;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
