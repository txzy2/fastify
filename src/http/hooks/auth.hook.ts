import {FastifyReply, FastifyRequest, preHandlerHookHandler} from 'fastify';
import {AccessTokenPayload, ITokenService} from '@/modules/auth/token.service';
import {ApiErrors} from '@/utils/enums/errors';
import {AppError} from '@/utils/error-handler';

declare module 'fastify' {
    interface FastifyRequest {
        user?: AccessTokenPayload;
    }
}

/**
 * Создаёт preHandler-хук, который проверяет access-токен из заголовка Authorization
 * и кладёт его payload в `request.user`.
 *
 * @param {ITokenService} tokenService
 * @returns {preHandlerHookHandler}
 */
export const createAuthGuard = (tokenService: ITokenService): preHandlerHookHandler => {
    return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
        const header = request.headers.authorization;
        const prefix = 'Bearer ';

        if (!header || !header.startsWith(prefix)) {
            throw new AppError(ApiErrors.UNAUTHORIZED, 401);
        }

        request.user = await tokenService.verifyAccessToken(header.slice(prefix.length));
    };
};
