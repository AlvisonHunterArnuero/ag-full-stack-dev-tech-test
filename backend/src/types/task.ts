export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DbTask {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  user_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  userId: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TaskFilters {
  status?: 'completed' | 'pending';
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
