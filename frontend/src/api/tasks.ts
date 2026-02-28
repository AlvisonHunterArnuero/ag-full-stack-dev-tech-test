import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters, PaginatedTasks } from '../types/task';

const BASE_URL = '/api';

const getAuthHeaders = (token: string, includeContentType = true) => {
    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
    };
    if (includeContentType) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

export const tasksApi = {
    async getTasks(token: string, filters: TaskFilters = {}): Promise<PaginatedTasks> {
        const params = new URLSearchParams();
        if (filters.status && filters.status !== 'all') params.set('status', filters.status);
        if (filters.page) params.set('page', String(filters.page));
        if (filters.limit) params.set('limit', String(filters.limit));

        const url = `${BASE_URL}/tasks${params.toString() ? `?${params}` : ''}`;
        const response = await fetch(url, {
            headers: getAuthHeaders(token, false),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch tasks');
        return data;
    },

    async createTask(token: string, input: CreateTaskInput): Promise<Task> {
        const response = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(input),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to create task');
        return data;
    },

    async updateTask(token: string, id: number, input: UpdateTaskInput): Promise<Task> {
        const response = await fetch(`${BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(token),
            body: JSON.stringify(input),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to update task');
        return data;
    },

    async deleteTask(token: string, id: number): Promise<Task> {
        const response = await fetch(`${BASE_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(token, false),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to delete task');
        return data;
    },

    async toggleTask(token: string, task: Task): Promise<Task> {
        return tasksApi.updateTask(token, task.id, { completed: !task.completed });
    },
};
