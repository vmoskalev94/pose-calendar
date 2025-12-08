// src/features/auth/api.ts
import {httpClient} from '../../shared/api/httpClient';
import type {AuthUser, LoginRequest, LoginResponse} from './types';

export async function login(request: LoginRequest): Promise<LoginResponse> {
    const {data} = await httpClient.post<LoginResponse>(
        '/api/auth/login',
        request
    );
    return data;
}

export async function getCurrentUser(): Promise<AuthUser> {
    const {data} = await httpClient.get<AuthUser>('/api/auth/me');
    return data;
}
