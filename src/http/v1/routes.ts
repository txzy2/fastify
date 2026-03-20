import {FastifyInstance} from 'fastify';
import {UserController} from '@/modules/users/user.controller';
import type {UserRequestQuery, ApiResponse, UserRequestQueryByIdDto} from '@/types';
import {getUserByIdSchema, getUserSchema} from './schemas/user.schema';
import {Users} from '@prisma/client';

/**
 * Registers user routes on the Fastify instance.
 *
 * @param {FastifyInstance} fastifyInstance - Fastify instance to register routes on.
 * @param {UserController} userController - User controller to handle routes.
 */
export const registerUserRoutes = (
    fastifyInstance: FastifyInstance,
    userController: UserController
) => {
    fastifyInstance.get<{
        Querystring: UserRequestQuery;
        Reply: ApiResponse<Users>;
    }>('/user', {schema: getUserSchema}, userController.getUser);

    fastifyInstance.get<{
        Params: UserRequestQueryByIdDto;
        Reply: ApiResponse<Users>;
    }>('/user/:id', {schema: getUserByIdSchema}, userController.getUserById);
};
