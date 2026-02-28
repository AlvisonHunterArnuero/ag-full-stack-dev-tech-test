import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from './TaskForm';

describe('TaskForm', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    const defaultProps = {
        open: true,
        onClose: mockOnClose,
        onSubmit: mockOnSubmit,
    };

    it('renders "Create New Task" by default', () => {
        render(<TaskForm {...defaultProps} />);
        expect(screen.getByText('Create New Task')).toBeInTheDocument();
        expect(screen.getByLabelText(/Task Title/i)).toHaveValue('');
    });

    it('renders "Edit Task" and populates fields when task is provided', () => {
        const task = { id: 1, userId: 1, title: 'Completed Elixir Fundamentals Course', description: 'Finished Elixir Fundamentals Course', completed: false, createdAt: '', updatedAt: '' };
        render(<TaskForm {...defaultProps} task={task} />);
        expect(screen.getByText('Edit Task')).toBeInTheDocument();
        expect(screen.getByLabelText(/Task Title/i)).toHaveValue('Completed Elixir Fundamentals Course');
        expect(screen.getByLabelText(/Description/i)).toHaveValue('Finished Elixir Fundamentals Course');
    });

    it('shows validation errors when submitting empty fields', async () => {
        render(<TaskForm {...defaultProps} />);
        const submitButton = screen.getByRole('button', { name: /Create Task/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText('Title is required')).toBeInTheDocument();
        expect(await screen.findByText('Description is required')).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with correct data when validated', async () => {
        render(<TaskForm {...defaultProps} />);

        fireEvent.change(screen.getByLabelText(/Task Title/i), { target: { value: 'Prepare PriceSmart Monthly Shopping List' } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Finish PriceSmart Monthly Shopping List' } });

        const submitButton = screen.getByRole('button', { name: /Create Task/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                title: 'Prepare PriceSmart Monthly Shopping List',
                description: 'Finish PriceSmart Monthly Shopping List'
            });
        });
    });

    it('calls onClose when cancel is clicked', () => {
        render(<TaskForm {...defaultProps} />);
        const cancelButton = screen.getByRole('button', { name: /Cancel/i });
        fireEvent.click(cancelButton);
        expect(mockOnClose).toHaveBeenCalled();
    });
});
