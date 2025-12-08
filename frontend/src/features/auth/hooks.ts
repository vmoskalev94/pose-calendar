// src/features/auth/hooks.ts
import {useMutation} from '@tanstack/react-query';
import {login} from './api';
import type {LoginRequest, LoginResponse} from './types';

export const useLoginMutation = () =>
    useMutation<LoginResponse, unknown, LoginRequest>({
        mutationFn: login,
    });
