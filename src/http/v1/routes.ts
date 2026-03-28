import fastify, {FastifyInstance} from 'fastify';
import {UserController} from '@/modules/users/user.controller';
import type {ApiResponse} from '@/types';
import {getUserByIdSchema, getUserSchema, registerUserSchema} from './schemas/user.schema';
import {UserRequestQuery, UserRequestQueryByIdDto} from '@/modules/users/dto/user-requests.dto';
import {RegisterUserResponseDto, UserResponseDto} from '@/modules/users/dto/user-response.dto';
import {RegisterUserDto} from '../../modules/users/dto/user-requests.dto';
import {validateBody} from '../hooks/validate-body.hook';
import {logRequest} from '../hooks/log-request.hook';
import {validateQuery} from '../hooks/validate-query.hook';

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
        Reply: ApiResponse<UserResponseDto>;
    }>(
        '/user',
        {
            schema: getUserSchema,
            preHandler: [logRequest, validateQuery(UserRequestQuery)]
        },
        userController.getUserByName
    );

    fastifyInstance.get<{
        Params: UserRequestQueryByIdDto;
        Reply: ApiResponse<UserResponseDto>;
    }>(
        '/user/:id',
        {preHandler: [logRequest], schema: getUserByIdSchema},
        userController.getUserById
    );

    fastifyInstance.post<{
        Body: RegisterUserDto;
        Reply: ApiResponse<RegisterUserResponseDto>;
    }>(
        '/user/register',
        {
            preHandler: [logRequest, validateBody(RegisterUserDto)],
            schema: registerUserSchema
        },
        userController.registerUser
    );
};
