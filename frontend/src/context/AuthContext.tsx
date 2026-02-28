import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginInput, RegisterInput } from '../types/user';
import { authApi } from '../api/auth';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'taskmanager_token';
const USER_KEY = 'taskmanager_user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (token && user) {
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
    }, [token, user]);

    const login = async (input: LoginInput) => {
        setIsLoading(true);
        try {
            const result = await authApi.login(input);
            setUser(result.user);
            setToken(result.token);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (input: RegisterInput) => {
        setIsLoading(true);
        try {
            const result = await authApi.register(input);
            setUser(result.user);
            setToken(result.token);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        // Clear TanStack Query cache
        import('@tanstack/react-query').then(({ QueryClient }) => {
            // This is a bit tricky since we don't have direct access to the client instance here
            // without passing it or using a more global setup.
            // But clearing it in Dashboard or App is better.
        });
        // Actually, let's just use window.location.reload() for a hard reset as a safe fallback
        // if we can't easily reach the queryClient here.
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                register,
                logout,
                isAuthenticated: !!token && !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
