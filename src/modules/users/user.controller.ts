import {FastifyRequest} from 'fastify';
import {IUserService} from '@/modules/users/user.service';
import type {
    RegisterUserDto,
    UserRequestQuery,
    UserRequestQueryByIdDto
} from './dto/user-requests.dto';
import {ApiReply} from '@/types';
import {RegisterUserResponseDto, UserResponseDto} from './dto/user-response.dto';
import {IRegisterUserUseCase} from './use-case/register-user.use-case';

export class UserController {
    public constructor(
        private readonly userService: IUserService,
        private readonly registerUserUseCase: IRegisterUserUseCase
    ) {}

    /**
     * getUserByName - контроллер получения пользователя по имени
     *
     * @param {FastifyRequest<{Querystring: UserRequestQuery}>} request
     *
     * @returns {Promise<void>}
     */
    public getUserByName = async (
        request: FastifyRequest<{Querystring: UserRequestQuery}>,
        reply: ApiReply<UserResponseDto>
    ): Promise<void> => {
        const {name} = request.query;
        reply.status(200).send({success: true, data: await this.userService.findByName(name)});
    };

    /**
     * getUserById - контроллер получения пользователя по id
     *
     * @param {FastifyRequest<{Params: UserRequestQueryByIdDto}>} request
     *
     * @returns {Promise<void>}
     */
    public getUserById = async (
        request: FastifyRequest<{Params: UserRequestQueryByIdDto}>,
        reply: ApiReply<UserResponseDto>
    ): Promise<void> => {
        const {id} = request.params;
        reply.status(200).send({success: true, data: await this.userService.findById(id)});
    };

    /**
     * registerUser - контроллер регистрации пользователя
     *
     * @param {FastifyRequest<{Body: RegisterUserDto}>} request
     * @param {ApiReply<RegisterUserResponseDto>} reply
     * @returns {Promise<void>}
     */
    public registerUser = async (
        request: FastifyRequest<{Body: RegisterUserDto}>,
        reply: ApiReply<RegisterUserResponseDto>
    ): Promise<void> => {
        const {body} = request;
        reply.status(201).send({success: true, data: await this.registerUserUseCase.execute(body)});
    };
}
