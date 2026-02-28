import { useState } from 'react';
import {
    Card, CardContent, CardActions, Typography, Checkbox, IconButton,
    Tooltip, Box, Chip, LinearProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { Task } from '../types/task';

interface TaskCardProps {
    task: Task;
    onToggle: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    isToggling?: boolean;
    isDeleting?: boolean;
}

export function TaskCard({ task, onToggle, onEdit, onDelete, isToggling, isDeleting }: TaskCardProps) {
    const [hovered, setHovered] = useState(false);

    const formattedDate = task.createdAt
        ? new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null;

    return (
        <Card
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                background: task.completed
                    ? 'rgba(16, 185, 129, 0.05)'
                    : 'rgba(26, 26, 46, 0.8)',
                backdropFilter: 'blur(16px)',
                border: task.completed
                    ? '1px solid rgba(16, 185, 129, 0.2)'
                    : hovered
                        ? '1px solid rgba(99, 102, 241, 0.4)'
                        : '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hovered ? 'translateY(-2px)' : 'none',
                boxShadow: hovered
                    ? '0 12px 40px rgba(99, 102, 241, 0.15)'
                    : '0 2px 8px rgba(0,0,0,0.3)',
                opacity: isDeleting ? 0.5 : 1,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {(isToggling || isDeleting) && (
                <LinearProgress
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: 'rgba(99, 102, 241, 0.1)',
                        '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                        },
                    }}
                />
            )}

            <CardContent sx={{ pb: 1, pt: 2, px: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    {/* Checkbox */}
                    <Checkbox
                        checked={task.completed}
                        onChange={() => onToggle(task)}
                        disabled={isToggling}
                        icon={<RadioButtonUncheckedIcon sx={{ color: '#475569', fontSize: 22 }} />}
                        checkedIcon={<CheckCircleIcon sx={{ color: '#10b981', fontSize: 22 }} />}
                        sx={{ p: 0, mt: 0.3, flexShrink: 0 }}
                    />

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{
                                color: task.completed ? '#64748b' : '#e2e8f0',
                                textDecoration: task.completed ? 'line-through' : 'none',
                                letterSpacing: '-0.2px',
                                lineHeight: 1.4,
                                wordBreak: 'break-word',
                            }}
                        >
                            {task.title}
                        </Typography>
                        {task.description && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: task.completed ? '#475569' : '#94a3b8',
                                    mt: 0.5,
                                    lineHeight: 1.5,
                                    wordBreak: 'break-word',
                                }}
                            >
                                {task.description}
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5 }}>
                            <Chip
                                label={task.completed ? 'Completed' : 'Pending'}
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    background: task.completed
                                        ? 'rgba(16, 185, 129, 0.15)'
                                        : 'rgba(245, 158, 11, 0.15)',
                                    color: task.completed ? '#10b981' : '#f59e0b',
                                    border: `1px solid ${task.completed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                                }}
                            />
                            {formattedDate && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <AccessTimeIcon sx={{ fontSize: 12, color: '#475569' }} />
                                    <Typography variant="caption" sx={{ color: '#475569' }}>
                                        {formattedDate}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 1.5, pt: 0 }}>
                <Tooltip title="Edit task">
                    <IconButton
                        size="small"
                        onClick={() => onEdit(task)}
                        sx={{
                            color: '#94a3b8',
                            '&:hover': { color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)' },
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete task">
                    <IconButton
                        size="small"
                        onClick={() => onDelete(task)}
                        disabled={isDeleting}
                        sx={{
                            color: '#94a3b8',
                            '&:hover': { color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' },
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
}
