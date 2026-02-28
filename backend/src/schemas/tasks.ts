export const createTaskSchema = {
  body: {
    type: 'object',
    required: ['title', 'description'],
    properties: {
      title: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 1 },
    },
  },
};

export const updateTaskSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 1 },
      completed: { type: 'boolean' },
    },
  },
};

export const idParamSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', pattern: '^[0-9]+$' },
    },
  },
};

export const taskQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      status: { type: 'string', enum: ['completed', 'pending'] },
      page: { type: 'string', pattern: '^[0-9]+$' },
      limit: { type: 'string', pattern: '^[0-9]+$' },
      all: { type: 'string', enum: ['true', 'false'] },
    },
  },
};
