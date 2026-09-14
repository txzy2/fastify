import {preHandlerHookHandler} from 'fastify';
import {PrismaService} from '@/prisma/prisma.service';
import {RedisService} from '@/redis/redis.service';
import {UserService} from '@/modules/users/user.service';
import {UserController} from '@/modules/users/user.controller';
import {AuthController} from '@/modules/auth/auth.controller';
import {UserRepository} from '@/modules/users/user.repository';
import {RegisterUserUseCase} from '@/modules/auth/use-case/register-user.use-case';
import {LicensesService} from '@/modules/licenses/licenses.service';
import {LicensesRepository} from '@/modules/licenses/licenses.repository';
import {ILogger} from '@/core/logger';
import {AuthService} from '@/modules/auth/auth.service';
import {TokenService} from '@/modules/auth/token.service';
import {RefreshTokenRepository} from '@/modules/auth/refresh-token.repository';
import {createAuthGuard} from '@/http/hooks/auth.hook';

export interface Container {
    prismaService: PrismaService;
    redisService: RedisService;
    authGuard: preHandlerHookHandler;
    userController: UserController;
    authController: AuthController;
}

/**
 * Creates an instance of the application container.
 *
 * The container contains the Prisma service and the application controllers.
 *
 * @returns {Promise<Container>} - A promise that resolves to an instance of the application container.
 */
export const createContainer = async (logger: ILogger): Promise<Container> => {
    const prismaService = new PrismaService();
    await prismaService.connect();

    const redisService = new RedisService();
    await redisService.connect();

    // === Repositories ===
    const userRepository = new UserRepository(prismaService);
    const licensesRepository = new LicensesRepository(prismaService);
    const refreshTokenRepository = new RefreshTokenRepository(redisService);

    // === Services ===
    const tokenService = new TokenService();
    const userService = new UserService(userRepository, logger);
    const licensesService = new LicensesService(licensesRepository, logger);
    const authService = new AuthService(
        userRepository,
        tokenService,
        refreshTokenRepository,
        logger
    );

    // === Use Cases ===
    const createUserUseCase = new RegisterUserUseCase(
        userService,
        licensesService,
        prismaService,
        logger
    );

    // === Controllers ===
    const userController = new UserController(userService);
    const authController = new AuthController(createUserUseCase, authService);

    // === Hooks ===
    const authGuard = createAuthGuard(tokenService);

    return {
        prismaService,
        redisService,
        authGuard,
        userController,
        authController
    };
};
