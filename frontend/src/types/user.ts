export type UserRole = 'admin' | 'user';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    created_at?: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
