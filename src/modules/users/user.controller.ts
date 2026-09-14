import {FastifyRequest} from 'fastify';
import {IUserService} from '@/modules/users/user.service';
import type {UserRequestQueryByIdDto} from './dto/user-requests.dto';
import {ApiReply} from '@/types';
import {apiSuccess} from '@/utils/helpers/response.helper';
import {UserResponseDto} from './dto/user-response.dto';

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
        const user = await this.userService.findById(id);
        await reply.status(200).send(apiSuccess(user));
    };
}
