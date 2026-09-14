import {FastifyInstance} from 'fastify';
import {UserController} from '@/modules/users/user.controller';
import type {ApiResponse} from '@/types';
import {getUserByIdSchema} from '../schemas/user.schema';
import {UserRequestQueryByIdDto} from '@/modules/users/dto/user-requests.dto';
import {UserResponseDto} from '@/modules/users/dto/user-response.dto';
import {logRequest} from '../../hooks/log-request.hook';

/**
 * Registers user retrieval routes on the Fastify instance.
 *
 * @param {FastifyInstance} fastifyInstance - Fastify instance to register routes on.
 * @param {UserController} userController - User controller to handle routes.
 */
export const registerUserRoutes = (
    fastifyInstance: FastifyInstance,
    userController: UserController
) => {
    fastifyInstance.get<{
        Params: UserRequestQueryByIdDto;
        Reply: ApiResponse<UserResponseDto>;
    }>(
        '/user/:id',
        {preHandler: [logRequest], schema: getUserByIdSchema},
        userController.getUserById
    );
};
