import {UserActivity, Users} from '@prisma/client';
import {SERVER_CONFIG} from '@/core/config';
import {ILogger} from '@/core/logger';
import {ApiErrors} from '@/utils/enums/errors';
import {AppError} from '@/utils/error-handler';
import {verifyPassword} from '@/utils/helpers/passwords.helper';
import {LoginUserDto} from '../users/dto/user-requests.dto';
import {LoginUserResponseDto} from '../users/dto/user-response.dto';
import {IUserRepository} from '../users/user.repository';
import {IRefreshTokenRepository} from './refresh-token.repository';
import {ITokenService} from './token.service';

export interface IAuthService {
    login(data: LoginUserDto): Promise<LoginUserResponseDto>;
    refresh(refreshToken: string): Promise<LoginUserResponseDto>;
    logout(refreshToken: string, userId: string): Promise<void>;
}

export class AuthService implements IAuthService {
    public constructor(
        private readonly userRepository: IUserRepository,
        private readonly tokenService: ITokenService,
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private readonly logger: ILogger
    ) {}

    /**
     * login - аутентификация по email и паролю, выдача пары токенов.
     *
     * @param {LoginUserDto} data
     * @returns {Promise<LoginUserResponseDto>}
     * @throws {AppError} 401 при неверных данных или неактивном пользователе
     */
    public async login(data: LoginUserDto): Promise<LoginUserResponseDto> {
        const user = await this.userRepository.getByParams({email: data.email});
        const passwordValid = user ? await verifyPassword(user.password, data.password) : false;

        if (!user || user.active !== UserActivity.ACTIVE || !passwordValid) {
            this.logger.warn(`Failed login attempt for email ${data.email}`);
            throw new AppError(ApiErrors.INVALID_CREDENTIALS, 404);
        }

        return await this.issueTokens(user);
    }

    /**
     * refresh - обмен refresh-токена на новую пару токенов (с ротацией).
     *
     * @param {string} refreshToken
     * @returns {Promise<LoginUserResponseDto>}
     * @throws {AppError} 401 если refresh-токен недействителен
     */
    public async refresh(refreshToken: string): Promise<LoginUserResponseDto> {
        const reusedByUserId = await this.refreshTokenRepository.getUsedUserId(refreshToken);

        if (reusedByUserId) {
            await this.refreshTokenRepository.removeAllForUser(reusedByUserId);
            this.logger.warn(
                `Refresh token reuse detected for user ${reusedByUserId}; all sessions revoked`
            );
            throw new AppError(ApiErrors.REFRESH_TOKEN_INVALID, 401);
        }

        const userId = await this.refreshTokenRepository.getUserId(refreshToken);
        if (!userId) {
            throw new AppError(ApiErrors.REFRESH_TOKEN_INVALID, 401);
        }

        const user = await this.userRepository.getById(userId);
        if (!user || user.active !== UserActivity.ACTIVE) {
            await this.refreshTokenRepository.remove(refreshToken);
            throw new AppError(ApiErrors.REFRESH_TOKEN_INVALID, 401);
        }

        await this.refreshTokenRepository.remove(refreshToken);
        await this.refreshTokenRepository.markUsed(
            refreshToken,
            userId,
            SERVER_CONFIG.jwt.refreshTtlSeconds
        );

        return await this.issueTokens(user);
    }

    /**
     * logout - отзыв refresh-токена. Удаляет токен только если он принадлежит
     * текущему (аутентифицированному) пользователю, чтобы нельзя было разлогинить
     * чужую сессию, зная только refresh-токен.
     *
     * @param {string} refreshToken
     * @param {string} userId - id пользователя из access-токена
     */
    public async logout(refreshToken: string, userId: string): Promise<void> {
        const ownerId = await this.refreshTokenRepository.getUserId(refreshToken);

        if (ownerId && ownerId === userId) {
            await this.refreshTokenRepository.remove(refreshToken);
        }
    }

    private async issueTokens(user: Users): Promise<LoginUserResponseDto> {
        const access_token = await this.tokenService.signAccessToken({
            sub: user.id,
            email: user.email
        });
        const refresh_token = this.tokenService.generateRefreshToken();

        await this.refreshTokenRepository.save(
            refresh_token,
            user.id,
            SERVER_CONFIG.jwt.refreshTtlSeconds
        );

        return {access_token, refresh_token};
    }
}
