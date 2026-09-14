import {FastifyRequest} from 'fastify';
import {IUserService} from '@/modules/users/user.service';
import type {UserRequestQueryByIdDto} from './dto/user-requests.dto';
import {ApiReply} from '@/types';
import {apiSuccess} from '@/utils/helpers/response.helper';
import {UserResponseDto} from './dto/user-response.dto';
import {ApiErrors} from '@/utils/enums/errors';
import {AppError} from '@/utils/error-handler';

export class UserController {
    public constructor(private readonly userService: IUserService) {}

    /**
     * getUserById - контроллер получения пользователя по id
     *
     * @param {FastifyRequest<{Params: UserRequestQueryByIdDto}>} request
     *
     * @param reply
     * @returns {Promise<void>}
     */
    public getUserById = async (
        request: FastifyRequest<{Params: UserRequestQueryByIdDto}>,
        reply: ApiReply<UserResponseDto>
    ): Promise<void> => {
        const {id} = request.params;
        await reply.status(200).send(apiSuccess(await this.userService.findById(id)));
    };

    /**
     * getMe - контроллер получения текущего пользователя по access-токену.
     *
     * @param {FastifyRequest} request
     * @param {ApiReply<UserResponseDto>} reply
     * @returns {Promise<void>}
     */
    public getMe = async (
        request: FastifyRequest,
        reply: ApiReply<UserResponseDto>
    ): Promise<void> => {
        const userId = request.user?.sub;

        if (!userId) {
            throw new AppError(ApiErrors.UNAUTHORIZED, 401);
        }

        await reply.status(200).send(apiSuccess(await this.userService.findById(userId)));
    };
}
