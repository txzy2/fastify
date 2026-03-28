import {AppError} from '@/utils/error-handler';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import {validate} from 'class-validator';
import {FastifyRequest, FastifyReply} from 'fastify';

export const validateQuery = <T extends object>(cls: ClassConstructor<T>) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const instance = plainToInstance(cls, request.query);
        const errors = await validate(instance);

        if (errors.length > 0) {
            const message = errors
                .map(e => Object.values(e.constraints || {}).join(', '))
                .join(', ');
            throw new AppError(message, 400);
        }

        request.query = instance as any;
    };
};
