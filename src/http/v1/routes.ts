import {FastifyInstance} from 'fastify';
import {UserController} from '@/modules/users/user.controller';
import type {ApiResponse} from '@/types';
import {getUserByIdSchema, registerUserSchema} from './schemas/user.schema';
import {UserRequestQueryByIdDto} from '@/modules/users/dto/user-requests.dto';
import {RegisterUserResponseDto, UserResponseDto} from '@/modules/users/dto/user-response.dto';
import {RegisterUserDto} from '../../modules/users/dto/user-requests.dto';
import {logRequest} from '../hooks/log-request.hook';
import {validatePassword} from '../hooks/validate-password.hook';

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
        {preHandler: [logRequest, validatePassword], schema: registerUserSchema},
        userController.registerUser
    );
};
