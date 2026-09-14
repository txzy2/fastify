import {FastifyInstance} from 'fastify';
import {AuthController} from '@/modules/auth/auth.controller';
import type {ApiResponse} from '@/types';
import {registerUserSchema} from '../schemas/auth.schema';
import {RegisterUserDto} from '@/modules/users/dto/user-requests.dto';
import {RegisterUserResponseDto} from '@/modules/users/dto/user-response.dto';
import {logRequest} from '../../hooks/log-request.hook';
import {validatePassword} from '../../hooks/validate-password.hook';

/**
 * Registers auth routes on the Fastify instance.
 *
 * @param {FastifyInstance} fastifyInstance - Fastify instance to register routes on.
 * @param {AuthController} authController - Auth controller to handle routes.
 */
export const registerAuthRoutes = (
    fastifyInstance: FastifyInstance,
    authController: AuthController
) => {
    fastifyInstance.post<{
        Body: RegisterUserDto;
        Reply: ApiResponse<RegisterUserResponseDto>;
    }>(
        '/auth/register',
        {preHandler: [logRequest, validatePassword], schema: registerUserSchema},
        authController.registerUser
    );
};
