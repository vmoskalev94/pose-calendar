// src/features/auth/types.ts

export type UserRole = 'ADMIN' | 'USER';

export interface AuthUser {
    id: number;
    username: string;
    displayName: string;
    role: UserRole;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: AuthUser;
}
