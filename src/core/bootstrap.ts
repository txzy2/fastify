import Fastify, {FastifyError, FastifyInstance} from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import {LOGGER_CONFIG} from '@/core/logger';
import {SERVER_CONFIG} from '@/core/config';
import {openApiDocs} from '@/http/v1/schemas/user.schema';
import {createContainer} from '@/core/container';
import {registerUserRoutes} from '@/http/v1/routes';
import {ApiErrors} from '@/utils/enums/errors';
import {AppError} from '@/utils/error-handler';

export const createApp = async (): Promise<FastifyInstance> => {
    const fastify = Fastify({logger: LOGGER_CONFIG});

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
            registerUserRoutes(instance, container.userController);
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
