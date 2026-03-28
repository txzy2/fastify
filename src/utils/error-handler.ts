import {FastifyReply, FastifyRequest} from 'fastify';
import {ApiErrors} from './enums/errors';

export class AppError extends Error {
    constructor(
        public error: ApiErrors | string,
        public statusCode: number = 500
    ) {
        super(error);
        this.name = 'AppError';
    }
}

export const handleServiceError = (
    error: unknown,
    reply: FastifyReply,
    log: FastifyRequest['log']
) => {
    log.error(error);

    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
            success: false,
            error: error.message
        });
    }

    return reply.status(500).send({
        success: false,
        error: ApiErrors.INTERNAL_SERVER_ERROR
    });
};
