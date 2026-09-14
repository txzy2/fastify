import {FastifyInstance} from 'fastify';
import {UserController} from '@/modules/users/user.controller';
import {AuthController} from '@/modules/auth/auth.controller';
import {registerUserRoutes} from './user.routes';
import {registerAuthRoutes} from './auth.routes';

interface RouteControllers {
    userController: UserController;
    authController: AuthController;
}

/**
 * Registers all application routes on the Fastify instance.
 *
 * @param {FastifyInstance} fastifyInstance - Fastify instance to register routes on.
 * @param {RouteControllers} controllers - Controllers to handle routes.
 */
export const registerRoutes = (
    fastifyInstance: FastifyInstance,
    controllers: RouteControllers
) => {
    registerUserRoutes(fastifyInstance, controllers.userController);
    registerAuthRoutes(fastifyInstance, controllers.authController);
};
