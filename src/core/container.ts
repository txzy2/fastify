import {PrismaService} from '@/prisma/prisma.service';
import {UserService} from '@/modules/users/user.service';
import {UserController} from '@/modules/users/user.controller';
import {UserRepository} from '@/modules/users/user.repository';

export interface Container {
    prismaService: PrismaService;
    userService: UserService;
    userController: UserController;
}

/**
 * Creates an instance of the application container.
 *
 * The container contains the Prisma service, the user service, and the user controller.
 *
 * @returns {Promise<Container>} - A promise that resolves to an instance of the application container.
 */
export const createContainer = async (): Promise<Container> => {
    const prismaService = new PrismaService();
    await prismaService.connect();

    const userRepository = new UserRepository(prismaService);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    return {
        prismaService,
        userService,
        userController
    };
};
