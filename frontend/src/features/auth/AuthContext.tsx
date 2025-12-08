// src/features/auth/AuthContext.tsx
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import type {AuthUser, LoginResponse} from './types';

const TOKEN_KEY = 'pose-calendar/token';
const USER_KEY = 'pose-calendar/user';

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
}

interface AuthContextValue extends AuthState {
    isAuthenticated: boolean;
    loginFromResponse: (response: LoginResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isLoading: true,
    });

    // начальная инициализация из localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
            try {
                const parsedUser: AuthUser = JSON.parse(storedUser);
                setState({
                    user: parsedUser,
                    token: storedToken,
                    isLoading: false,
                });
                return;
            } catch {
                // если что-то поломалось в localStorage — просто очистим
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            }
        }

        setState({
            user: null,
            token: null,
            isLoading: false,
        });
    }, []);

    const loginFromResponse = useCallback((response: LoginResponse) => {
        const {token, user} = response;

        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        setState({
            user,
            token,
            isLoading: false,
        });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        setState({
            user: null,
            token: null,
            isLoading: false,
        });
    }, []);

    const value: AuthContextValue = {
        ...state,
        isAuthenticated: !!state.token,
        loginFromResponse,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// удобный хук
export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
};
