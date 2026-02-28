import {
    AppBar, Toolbar, Typography, Avatar, Box, Chip, IconButton, Tooltip
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: 'rgba(15, 15, 35, 0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
                {/* Brand */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <TaskAltIcon sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.5px',
                        }}
                    >
                        TaskFlow
                    </Typography>
                </Box>

                {/* User Info + Logout */}
                {user && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {user.role === 'admin' && (
                            <Chip
                                icon={<AdminPanelSettingsIcon sx={{ fontSize: 14 }} />}
                                label="Admin"
                                size="small"
                                sx={{
                                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                }}
                            />
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                                sx={{
                                    width: 34,
                                    height: 34,
                                    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                }}
                            >
                                {initials}
                            </Avatar>
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="body2" fontWeight={600} sx={{ color: '#e2e8f0', lineHeight: 1.2 }}>
                                    {user.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                        <Tooltip title="Logout">
                            <IconButton
                                onClick={handleLogout}
                                size="small"
                                sx={{
                                    color: '#94a3b8',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '8px',
                                    '&:hover': { color: '#ef4444', borderColor: '#ef4444', background: 'rgba(239,68,68,0.08)' },
                                }}
                            >
                                <LogoutIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}
