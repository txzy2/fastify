import {FastifyRequest, FastifyReply} from 'fastify';
import {IUserService} from '@/modules/users/user.service';
import type {UserRequestQuery, ApiResponse, UserRequestQueryByIdDto} from '@/types';
import {Users} from '@prisma/client';

export class UserController {
    public constructor(private readonly userService: IUserService) {}

    /**
     * getUser - контроллер получения пользователя по имени
     *
     * @param {FastifyRequest<{Querystring: UserRequestQuery}>} request
     *
     * @returns {Promise<ApiResponse<Users>>}
     */
    public getUser = async (
        request: FastifyRequest<{Querystring: UserRequestQuery}>
    ): Promise<ApiResponse<Users>> => {
        const {name} = request.query;
        request.log.info({name}, '[UserController] GET USER');

        const user = await this.userService.findByName(name);
        return {success: true, data: user};
    };

    /**
     * getUserById - контроллер получения пользователя по id
     *
     * @param {FastifyRequest<{Params: UserRequestQueryByIdDto}>} request
     *
     * @returns {Promise<ApiResponse<Users>>}
     */
    public getUserById = async (
        request: FastifyRequest<{Params: UserRequestQueryByIdDto}>
    ): Promise<ApiResponse<Users>> => {
        const {id} = request.params;

        const user = await this.userService.findById(id);
        return {success: true, data: user};
    };
}
