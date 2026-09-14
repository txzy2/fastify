import Fastify, {FastifyError, FastifyInstance} from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import {LOGGER_CONFIG} from '@/core/logger';
import {SERVER_CONFIG} from '@/core/config';
import {openApiDocs} from '@/http/v1/schemas/user.schema';
import {createContainer} from '@/core/container';
import {registerRoutes} from '@/http/v1/routes';
import {ApiErrors} from '@/utils/enums/errors';
import {AppError} from '@/utils/error-handler';

import cors from '@fastify/cors';

export const createApp = async (): Promise<FastifyInstance> => {
    const fastify = Fastify({logger: LOGGER_CONFIG});

    if (SERVER_CONFIG.node == 'dev') {
        await fastify.register(cors, {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        });
    }

    fastify.setErrorHandler((error, request, reply) => {
        request.log.error(error);
        const fastifyError = error as FastifyError;

        if (error instanceof AppError) {
            return reply.status(error.statusCode).send({
                success: false,
                error: error.message
            });
        }

        if (fastifyError.code === 'FST_ERR_VALIDATION') {
            return reply.status(400).send({
                success: false,
                error: fastifyError.message
            });
        }

        return reply.status(500).send({
            success: false,
            error: ApiErrors.INTERNAL_SERVER_ERROR
        });
    });

    const container = await createContainer(fastify.log);

    fastify.addHook('onClose', async () => {
        await container.prismaService.disconnect();
    });

    await fastify.register(swagger, {openapi: openApiDocs});
    await fastify.register(swaggerUi, {routePrefix: '/docs'});

    fastify.register(
        instance => {
            registerRoutes(instance, {
                userController: container.userController,
                authController: container.authController
            });
        },
        {prefix: '/api/v1'}
    );

    return fastify;
};

export const startApp = async (): Promise<void> => {
    const fastify = await createApp();

    try {
        await fastify.listen({
            port: SERVER_CONFIG.port,
            host: SERVER_CONFIG.host
        });
        fastify.log.info(`Server listening on http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
