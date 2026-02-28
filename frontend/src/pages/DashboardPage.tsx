import { useState } from 'react';
import {
    Box, Typography, Button, ToggleButtonGroup, ToggleButton,
    Fab, Skeleton, Alert, Pagination, Divider,
    Snackbar, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TaskIcon from '@mui/icons-material/Task';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Navbar } from '../components/Navbar';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { tasksApi } from '../api/tasks';
import { useAuth } from '../context/AuthContext';
import type { Task, CreateTaskInput, TaskFilters } from '../types/task';

const TASKS_PER_PAGE = 6;

export function DashboardPage() {
    const { token, user } = useAuth();
    const queryClient = useQueryClient();

    // State
    const [filter, setFilter] = useState<TaskFilters['status']>('all');
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Task | null>(null);
    const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Queries
    const { data, isLoading, isError } = useQuery({
        queryKey: ['tasks', user?.id, filter, page],
        queryFn: () => tasksApi.getTasks(token!, { status: filter, page, limit: TASKS_PER_PAGE }),
        enabled: !!token && !!user,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (input: CreateTaskInput) => tasksApi.createTask(token!, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
            setFormOpen(false);
            setSnackbar({ message: 'Task created successfully!', severity: 'success' });
        },
        onError: (err: Error) => setSnackbar({ message: err.message, severity: 'error' }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateTaskInput & { completed: boolean }> }) =>
            tasksApi.updateTask(token!, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
            setFormOpen(false);
            setEditTask(null);
            setTogglingId(null);
            setSnackbar({ message: 'Task updated!', severity: 'success' });
        },
        onError: (err: Error) => {
            setTogglingId(null);
            setSnackbar({ message: err.message, severity: 'error' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => tasksApi.deleteTask(token!, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] });
            setDeleteConfirm(null);
            setDeletingId(null);
            setSnackbar({ message: 'Task deleted.', severity: 'success' });
        },
        onError: (err: Error) => {
            setDeletingId(null);
            setSnackbar({ message: err.message, severity: 'error' });
        },
    });

    // Handlers
    const handleToggle = (task: Task) => {
        setTogglingId(task.id);
        updateMutation.mutate({ id: task.id, data: { completed: !task.completed } });
    };

    const handleEdit = (task: Task) => {
        setEditTask(task);
        setFormOpen(true);
    };

    const handleDeleteConfirm = (task: Task) => {
        setDeleteConfirm(task);
    };

    const handleDeleteExecute = () => {
        if (!deleteConfirm) return;
        setDeletingId(deleteConfirm.id);
        deleteMutation.mutate(deleteConfirm.id);
    };

    const handleFormSubmit = async (input: CreateTaskInput) => {
        if (editTask) {
            await updateMutation.mutateAsync({ id: editTask.id, data: input });
        } else {
            await createMutation.mutateAsync(input);
        }
    };

    const handleFilterChange = (_: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
        if (newFilter !== null) {
            setFilter(newFilter as TaskFilters['status']);
            setPage(1);
        }
    };

    const tasks = data?.tasks ?? [];
    const totalPages = data?.totalPages ?? 1;
    const total = data?.total ?? 0;

    return (
        <Box sx={{ minHeight: '100vh', background: '#0f0f23' }}>
            <Navbar />

            <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{
                            color: '#e2e8f0',
                            letterSpacing: '-0.5px',
                            mb: 0.5,
                        }}
                    >
                        Good {getGreeting()},{' '}
                        <span style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {user?.name?.split(' ')[0]}!
                        </span>
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                        {total > 0 ? `You have ${total} task${total === 1 ? '' : 's'}` : 'No tasks yet — create your first one!'}
                    </Typography>
                </Box>

                {/* Stats Bar */}
                {data && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            mb: 3,
                            flexWrap: 'wrap',
                        }}
                    >
                        <StatChip
                            label={`${data.total} Total`}
                            icon={<FormatListBulletedIcon sx={{ fontSize: 14 }} />}
                            color="#6366f1"
                        />
                        <StatChip
                            label={`${tasks.filter(t => t.completed).length + (filter === 'completed' ? data.total - tasks.length : 0)} Completed`}
                            icon={<CheckCircleOutlineIcon sx={{ fontSize: 14 }} />}
                            color="#10b981"
                        />
                        <StatChip
                            label={`${tasks.filter(t => !t.completed).length + (filter === 'pending' ? data.total - tasks.length : 0)} Pending`}
                            icon={<PendingActionsIcon sx={{ fontSize: 14 }} />}
                            color="#f59e0b"
                        />
                    </Box>
                )}

                {/* Filter Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 3,
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <ToggleButtonGroup
                        value={filter}
                        exclusive
                        onChange={handleFilterChange}
                        size="small"
                        sx={{
                            background: 'rgba(26, 26, 46, 0.8)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '12px',
                            p: 0.5,
                            gap: 0.5,
                            '& .MuiToggleButtonGroup-grouped': {
                                border: 'none',
                                borderRadius: '8px !important',
                                px: 2,
                                py: 0.75,
                                color: '#64748b',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                transition: 'all 0.15s',
                                '&.Mui-selected': {
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    color: 'white',
                                    '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #3730a3)' },
                                },
                                '&:not(.Mui-selected)': {
                                    '&:hover': { background: 'rgba(255,255,255,0.05)', color: '#e2e8f0' },
                                },
                            },
                        }}
                    >
                        <ToggleButton value="all">All</ToggleButton>
                        <ToggleButton value="pending">Pending</ToggleButton>
                        <ToggleButton value="completed">Completed</ToggleButton>
                    </ToggleButtonGroup>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => { setEditTask(null); setFormOpen(true); }}
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            borderRadius: '10px',
                            fontWeight: 700,
                            px: 2.5,
                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #4f46e5, #3730a3)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                            },
                            transition: 'all 0.2s',
                        }}
                    >
                        New Task
                    </Button>
                </Box>

                <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.05)' }} />

                {/* Task List */}
                {isLoading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {[...Array(4)].map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="rounded"
                                height={110}
                                sx={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px' }}
                            />
                        ))}
                    </Box>
                ) : isError ? (
                    <Alert
                        severity="error"
                        sx={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '12px',
                            color: '#fca5a5',
                        }}
                    >
                        Failed to load tasks. Please try again.
                    </Alert>
                ) : tasks.length === 0 ? (
                    <EmptyState filter={filter} onCreate={() => { setEditTask(null); setFormOpen(true); }} />
                ) : (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onToggle={handleToggle}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteConfirm}
                                    isToggling={togglingId === task.id}
                                    isDeleting={deletingId === task.id}
                                />
                            ))}
                        </Box>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={(_, p) => setPage(p)}
                                    shape="rounded"
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            color: '#64748b',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            borderRadius: '8px',
                                            '&:hover': { background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' },
                                            '&.Mui-selected': {
                                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                                color: 'white',
                                                border: 'none',
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        )}
                    </>
                )}
            </Box>

            {/* FAB for mobile */}
            <Fab
                onClick={() => { setEditTask(null); setFormOpen(true); }}
                sx={{
                    display: { xs: 'flex', sm: 'none' },
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                    '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #db2777)' },
                }}
            >
                <AddIcon sx={{ color: 'white' }} />
            </Fab>

            {/* Task Form Dialog */}
            <TaskForm
                open={formOpen}
                onClose={() => { setFormOpen(false); setEditTask(null); }}
                onSubmit={handleFormSubmit}
                task={editTask}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

            {/* Delete Confirmation */}
            <Dialog
                open={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                PaperProps={{
                    sx: {
                        background: '#1a1a2e',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        maxWidth: 380,
                    },
                }}
            >
                <DialogTitle sx={{ color: '#e2e8f0', fontWeight: 700 }}>Delete Task?</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: '#94a3b8' }}>
                        Are you sure you want to delete &quot;{deleteConfirm?.title}&quot;? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={() => setDeleteConfirm(null)}
                        sx={{ color: '#64748b', '&:hover': { background: 'rgba(255,255,255,0.05)' } }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteExecute}
                        disabled={deleteMutation.isPending}
                        sx={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            fontWeight: 600,
                            px: 2.5,
                            '&:hover': { background: 'rgba(239, 68, 68, 0.25)' },
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notifications */}
            <Snackbar
                open={!!snackbar}
                autoHideDuration={3000}
                onClose={() => setSnackbar(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar?.severity ?? 'success'}
                    onClose={() => setSnackbar(null)}
                    sx={{
                        background: snackbar?.severity === 'error'
                            ? 'rgba(239, 68, 68, 0.15)'
                            : 'rgba(16, 185, 129, 0.15)',
                        border: `1px solid ${snackbar?.severity === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                        borderRadius: '12px',
                        color: snackbar?.severity === 'error' ? '#fca5a5' : '#6ee7b7',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    {snackbar?.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    return 'evening';
}

function StatChip({ label, icon, color }: { label: string; icon: React.ReactNode; color: string }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                background: `${color}14`,
                border: `1px solid ${color}30`,
                borderRadius: '8px',
                px: 1.5,
                py: 0.75,
            }}
        >
            <Box sx={{ color, display: 'flex' }}>{icon}</Box>
            <Typography variant="caption" fontWeight={600} sx={{ color }}>
                {label}
            </Typography>
        </Box>
    );
}

function EmptyState({ filter, onCreate }: { filter: TaskFilters['status']; onCreate: () => void }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 10,
                gap: 2,
            }}
        >
            <Box
                sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '20px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                }}
            >
                <TaskIcon sx={{ fontSize: 32, color: '#6366f1' }} />
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#e2e8f0' }}>
                {filter === 'completed' ? 'No completed tasks' : filter === 'pending' ? 'No pending tasks' : 'No tasks yet'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', maxWidth: 280 }}>
                {filter === 'all'
                    ? 'Start by creating your first task and boost your productivity.'
                    : `You don't have any ${filter} tasks at the moment.`}
            </Typography>
            {filter === 'all' && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onCreate}
                    sx={{
                        mt: 1,
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        borderRadius: '10px',
                        fontWeight: 700,
                        '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #3730a3)' },
                    }}
                >
                    Create First Task
                </Button>
            )}
        </Box>
    );
}
