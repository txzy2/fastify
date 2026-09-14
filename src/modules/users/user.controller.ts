import {FastifyRequest} from 'fastify';
import {IUserService} from '@/modules/users/user.service';
import type {UserRequestQueryByIdDto, UserRequestQueryByNameDto} from './dto/user-requests.dto';
import {ApiReply} from '@/types';
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
        await reply.status(200).send({success: true, data: await this.userService.findById(id)});
    };

    /**
     * getUserByName - контроллер получения пользователя по имени
     *
     * @param {FastifyRequest<{Querystring: UserRequestQueryByNameDto}>} request
     * @param {ApiReply<UserResponseDto>} reply
     * @returns {Promise<void>}
     */
    public getUserByName = async (
        request: FastifyRequest<{Querystring: UserRequestQueryByNameDto}>,
        reply: ApiReply<UserResponseDto>
    ): Promise<void> => {
        const {name} = request.query;
        await reply.status(200).send({success: true, data: await this.userService.findByName(name)});
    };
}
