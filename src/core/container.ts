import {PrismaService} from '@/prisma/prisma.service';
import {UserService} from '@/modules/users/user.service';
import {UserController} from '@/modules/users/user.controller';
import {UserRepository} from '@/modules/users/user.repository';
import {RegisterUserUseCase} from '@/modules/users/use-case/register-user.use-case';
import {LicensesService} from '@/modules/licenses/licenses.service';
import {LicensesRepository} from '@/modules/licenses/licenses.repository';
import fastify from 'fastify';

export interface Container {
    prismaService: PrismaService;
    userController: UserController;
}

export interface ILogger {
    info(obj: object | string, msg?: string): void;
    error(obj: object | string, msg?: string): void;
    warn(obj: object | string, msg?: string): void;
}

/**
 * Creates an instance of the application container.
 *
 * The container contains the Prisma service, the user service, and the user controller.
 *
 * @returns {Promise<Container>} - A promise that resolves to an instance of the application container.
 */
export const createContainer = async (logger: ILogger): Promise<Container> => {
    const prismaService = new PrismaService();
    await prismaService.connect();

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
    const userController = new UserController(userService, createUserUseCase);

    return {
        prismaService,
        userController
    };
};
