import {AppError} from '@/utils/error-handler';
import {FastifyReply, FastifyRequest} from 'fastify';

export const validatePassword = async (request: FastifyRequest, reply: FastifyReply) => {
    const {password} = request.body as any;

    const errors = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};:'",.<>/?`~]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    if (errors.length > 0) {
        throw new AppError(errors.join(', '), 400);
    }
};
