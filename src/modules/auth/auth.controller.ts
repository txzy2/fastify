import {FastifyRequest} from 'fastify';
import {ApiReply} from '@/types';
import {apiSuccess} from '@/utils/helpers/response.helper';
import {
    LoginUserDto,
    RefreshTokenDto,
    RegisterUserDto
} from '@/modules/users/dto/user-requests.dto';
import {
    LoginUserResponseDto,
    LogoutResponseDto,
    RegisterUserResponseDto
} from '@/modules/users/dto/user-response.dto';
import {IRegisterUserUseCase} from '@/modules/auth/use-case/register-user.use-case';
import {IAuthService} from './auth.service';

export class AuthController {
    public constructor(
        private readonly registerUserUseCase: IRegisterUserUseCase,
        private readonly authService: IAuthService
    ) {}

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
        await reply.status(201).send(apiSuccess(await this.registerUserUseCase.execute(body)));
    };

    /**
     * loginUser - аутентификация и выдача пары токенов.
     *
     * @param {FastifyRequest<{Body: LoginUserDto}>} request
     * @param {ApiReply<LoginUserResponseDto>} reply
     * @returns {Promise<void>}
     */
    public loginUser = async (
        request: FastifyRequest<{Body: LoginUserDto}>,
        reply: ApiReply<LoginUserResponseDto>
    ): Promise<void> => {
        const {body} = request;
        await reply.status(200).send(apiSuccess(await this.authService.login(body)));
    };

    /**
     * refreshToken - обмен refresh-токена на новую пару токенов.
     *
     * @param {FastifyRequest<{Body: RefreshTokenDto}>} request
     * @param {ApiReply<LoginUserResponseDto>} reply
     * @returns {Promise<void>}
     */
    public refreshToken = async (
        request: FastifyRequest<{Body: RefreshTokenDto}>,
        reply: ApiReply<LoginUserResponseDto>
    ): Promise<void> => {
        const {refresh_token} = request.body;
        await reply.status(200).send(apiSuccess(await this.authService.refresh(refresh_token)));
    };

    /**
     * logout - отзыв refresh-токена.
     *
     * @param {FastifyRequest<{Body: RefreshTokenDto}>} request
     * @param {ApiReply<LogoutResponseDto>} reply
     * @returns {Promise<void>}
     */
    public logout = async (
        request: FastifyRequest<{Body: RefreshTokenDto}>,
        reply: ApiReply<LogoutResponseDto>
    ): Promise<void> => {
        const {refresh_token} = request.body;
        await this.authService.logout(refresh_token);
        await reply.status(200).send(apiSuccess({message: 'Выход выполнен'}));
    };
}
