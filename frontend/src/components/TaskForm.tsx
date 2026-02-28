import { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, IconButton, Typography, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EditIcon from '@mui/icons-material/Edit';
import type { Task, CreateTaskInput } from '../types/task';

interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTaskInput) => Promise<void>;
    task?: Task | null; // If provided, we're in edit mode
    isLoading?: boolean;
}

export function TaskForm({ open, onClose, onSubmit, task, isLoading }: TaskFormProps) {
    const isEdit = !!task;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

    useEffect(() => {
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTitle(task?.title ?? '');
             
            setDescription(task?.description ?? '');
             
            setErrors({});
        }
    }, [open, task]);

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit({ title: title.trim(), description: description.trim() });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    background: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                },
            }}
        >
            <DialogTitle sx={{ pb: 1, pt: 2.5, px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '10px',
                                background: isEdit
                                    ? 'linear-gradient(135deg, #6366f1, #818cf8)'
                                    : 'linear-gradient(135deg, #10b981, #34d399)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {isEdit ? (
                                <EditIcon sx={{ fontSize: 18, color: 'white' }} />
                            ) : (
                                <AddTaskIcon sx={{ fontSize: 18, color: 'white' }} />
                            )}
                        </Box>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#e2e8f0' }}>
                            {isEdit ? 'Edit Task' : 'Create New Task'}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{ color: '#64748b', '&:hover': { color: '#e2e8f0' } }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ px: 3, pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            label="Task Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            error={!!errors.title}
                            helperText={errors.title}
                            fullWidth
                            autoFocus
                            placeholder="E.g., Design homepage mockup"
                            sx={{
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
                            }}
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            error={!!errors.description}
                            helperText={errors.description}
                            multiline
                            rows={3}
                            fullWidth
                            placeholder="Describe what needs to be done..."
                            sx={{
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
                            }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                        sx={{
                            color: '#64748b',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '8px',
                            px: 2.5,
                            '&:hover': { background: 'rgba(255,255,255,0.05)' },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            borderRadius: '8px',
                            px: 3,
                            fontWeight: 600,
                            '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #3730a3)' },
                            '&.Mui-disabled': { background: 'rgba(99, 102, 241, 0.3)' },
                        }}
                    >
                        {isLoading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
