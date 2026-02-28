import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from './utils';
import { AuthPayload } from '../types/user';

// Extend FastifyRequest to include user
declare module 'fastify' {
    interface FastifyRequest {
        user: AuthPayload;
    }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({ error: 'Missing or invalid authorization header' });
        }

        const token = authHeader.slice(7);
        const payload = verifyToken(token);
        request.user = payload;
    } catch (error) {
        return reply.status(401).send({ error: 'Invalid or expired token' });
    }
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (request.user?.role !== 'admin') {
        return reply.status(403).send({ error: 'Admin access required' });
    }
}
