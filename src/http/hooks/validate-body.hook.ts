import {validate} from 'class-validator';
import {plainToInstance} from 'class-transformer';
import {ClassConstructor} from 'class-transformer';
import {FastifyRequest, FastifyReply} from 'fastify';
import {AppError} from '@/utils/error-handler';

export const validateBody = <T extends object>(cls: ClassConstructor<T>) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const instance = plainToInstance(cls, request.body);
        const errors = await validate(instance);

        if (errors.length > 0) {
            const message = errors
                .map(e => Object.values(e.constraints || {}).join(', '))
                .join(', ');
            throw new AppError(message, 400);
        }

        request.body = instance;
    };
};
