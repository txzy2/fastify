import {FastifyInstance} from 'fastify';
import {AuthController} from '@/modules/auth/auth.controller';
import type {ApiResponse} from '@/types';
import {
    loginUserSchema,
    logoutSchema,
    refreshTokenSchema,
    registerUserSchema
} from '../schemas/auth.schema';
import {
    LoginUserDto,
    RefreshTokenDto,
    RegisterUserDto
} from '@/modules/users/dto/user-requests.dto';
import {
    LoginUserResponseDto,
    LogoutResponseDto,
    RegisterUserResponseDto
} from '@/modules/users/dto/user-response.dto';
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

    fastifyInstance.post<{
        Body: LoginUserDto;
        Reply: ApiResponse<LoginUserResponseDto>;
    }>(
        '/auth/login',
        {preHandler: [logRequest], schema: loginUserSchema},
        authController.loginUser
    );

    fastifyInstance.post<{
        Body: RefreshTokenDto;
        Reply: ApiResponse<LoginUserResponseDto>;
    }>(
        '/auth/refresh',
        {preHandler: [logRequest], schema: refreshTokenSchema},
        authController.refreshToken
    );

    fastifyInstance.post<{
        Body: RefreshTokenDto;
        Reply: ApiResponse<LogoutResponseDto>;
    }>(
        '/auth/logout',
        {preHandler: [logRequest], schema: logoutSchema},
        authController.logout
    );
};
