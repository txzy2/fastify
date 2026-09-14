import {FastifyRequest} from 'fastify';
import {ApiReply} from '@/types';
import {apiSuccess} from '@/utils/helpers/response.helper';
import {RegisterUserDto} from '@/modules/users/dto/user-requests.dto';
import {RegisterUserResponseDto} from '@/modules/users/dto/user-response.dto';
import {IRegisterUserUseCase} from '@/modules/auth/use-case/register-user.use-case';

export class AuthController {
    public constructor(private readonly registerUserUseCase: IRegisterUserUseCase) {}

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
        const user = await this.registerUserUseCase.execute(body);
        await reply.status(201).send(apiSuccess(user));
    };
}
