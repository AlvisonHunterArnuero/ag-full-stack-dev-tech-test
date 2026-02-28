import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { authApi } from '../api/auth';

// Mock the authApi
vi.mock('../api/auth', () => ({
    authApi: {
        login: vi.fn(),
        register: vi.fn()
    }
}));

// Test component to consume the hook
const TestComponent = () => {
    const { user, login, isAuthenticated } = useAuth();
    return (
        <div>
            <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
            <div data-testid="user-email">{user?.email}</div>
            <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>Login</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        // Mock window.location
        vi.stubGlobal('location', { href: '' });
    });

    it('provides initial unauthenticated state', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    it('successfully logs in and updates state', async () => {
        const mockUser = { id: 1, email: 'test@example.com', name: 'Test User', role: 'user' as const, created_at: '', updated_at: '' };
        const mockToken = 'fake-token';
        vi.mocked(authApi.login).mockResolvedValue({ user: mockUser, token: mockToken });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        const loginButton = screen.getByText('Login');
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
            expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
        });

        expect(localStorage.getItem('taskmanager_token')).toBe(mockToken);
        expect(localStorage.getItem('taskmanager_user')).toContain('test@example.com');
    });

    it('loads initial state from localStorage', () => {
        const mockUser = { id: 1, email: 'stored@example.com', name: 'Stored User', role: 'user' as const, created_at: '', updated_at: '' };
        localStorage.setItem('taskmanager_user', JSON.stringify(mockUser));
        localStorage.setItem('taskmanager_token', 'stored-token');

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
        expect(screen.getByTestId('user-email')).toHaveTextContent('stored@example.com');
    });
});

import { fireEvent } from '@testing-library/react';
