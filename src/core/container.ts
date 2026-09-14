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

export interface Container {
    prismaService: PrismaService;
    redisService: RedisService;
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

    // === Services ===
    const userService = new UserService(userRepository, logger);
    const licensesService = new LicensesService(licensesRepository, logger);

    // === Use Cases ===
    const createUserUseCase = new RegisterUserUseCase(
        userService,
        licensesService,
        prismaService,
        logger
    );

    // === Controllers ===
    const userController = new UserController(userService);
    const authController = new AuthController(createUserUseCase);

    return {
        prismaService,
        redisService,
        userController,
        authController
    };
};
