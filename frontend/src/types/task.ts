export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    userId: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateTaskInput {
    title: string;
    description: string;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    completed?: boolean;
}

export interface TaskFilters {
    status?: 'completed' | 'pending' | 'all';
    page?: number;
    limit?: number;
}

export interface PaginatedTasks {
    tasks: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
