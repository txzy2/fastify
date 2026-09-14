import {FastifyRequest} from 'fastify';
import {IUserService} from '@/modules/users/user.service';
import type {RegisterUserDto, UserRequestQueryByIdDto} from './dto/user-requests.dto';
import {ApiReply} from '@/types';
import {RegisterUserResponseDto, UserResponseDto} from './dto/user-response.dto';
import {IRegisterUserUseCase} from './use-case/register-user.use-case';

export class UserController {
    public constructor(
        private readonly userService: IUserService,
        private readonly registerUserUseCase: IRegisterUserUseCase
    ) {}

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
        await reply
            .status(201)
            .send({success: true, data: await this.registerUserUseCase.execute(body)});
    };
}
