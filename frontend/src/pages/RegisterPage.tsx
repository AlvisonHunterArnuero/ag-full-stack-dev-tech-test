import { useState } from 'react';
import {
    Box, Card, CardContent, TextField, Button, Typography,
    Alert, CircularProgress, InputAdornment, IconButton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setIsLoading(true);
        try {
            await register({ name, email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(ellipse at 80% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%), #0f0f23',
                px: 2,
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    background: 'rgba(26, 26, 46, 0.9)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    {/* Logo */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #ec4899, #6366f1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)',
                            }}
                        >
                            <TaskAltIcon sx={{ fontSize: 28, color: 'white' }} />
                        </Box>
                        <Typography variant="h5" fontWeight={800} sx={{ color: '#e2e8f0', letterSpacing: '-0.5px' }}>
                            Create account
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                            Join TaskFlow and get organized
                        </Typography>
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 2.5,
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '10px',
                                color: '#fca5a5',
                                '& .MuiAlert-icon': { color: '#ef4444' },
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                fullWidth
                                autoComplete="name"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon sx={{ fontSize: 18, color: '#475569' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldSx}
                            />
                            <TextField
                                label="Email address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                                autoComplete="email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon sx={{ fontSize: 18, color: '#475569' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldSx}
                            />
                            <TextField
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                fullWidth
                                helperText="Minimum 6 characters"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon sx={{ fontSize: 18, color: '#475569' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                size="small"
                                                sx={{ color: '#475569' }}
                                            >
                                                {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                FormHelperTextProps={{ sx: { color: '#475569' } }}
                                sx={textFieldSx}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isLoading}
                                sx={{
                                    mt: 1,
                                    py: 1.4,
                                    background: 'linear-gradient(135deg, #ec4899, #6366f1)',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #db2777, #4f46e5)',
                                        boxShadow: '0 6px 20px rgba(236, 72, 153, 0.4)',
                                        transform: 'translateY(-1px)',
                                    },
                                    '&.Mui-disabled': { background: 'rgba(99, 102, 241, 0.3)', color: 'rgba(255,255,255,0.4)' },
                                    transition: 'all 0.2s',
                                }}
                            >
                                {isLoading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Create Account'}
                            </Button>
                        </Box>
                    </form>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}
                            >
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

const textFieldSx = {
    '& .MuiOutlinedInput-root': {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '10px',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
        '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.4)' },
        '&.Mui-focused fieldset': { borderColor: '#6366f1' },
    },
    '& .MuiInputLabel-root': { color: '#64748b' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
    '& .MuiOutlinedInput-input': { color: '#e2e8f0' },
};
