import {RegisterUserDto} from '../dto/user-requests.dto';
import {IUserService} from '../user.service';
import {ILicensesService, LicensesService} from '../../licenses/licenses.service';
import {PrismaService} from '@/prisma/prisma.service';
import {AppError} from '@/utils/error-handler';
import {ApiErrors} from '@/utils/enums/errors';
import {ILogger} from '@/core/container';
import {UserActivity} from '@prisma/client';
import {RegisterUserResponseDto} from '../dto/user-response.dto';

export interface IRegisterUserUseCase {
    execute(data: RegisterUserDto): Promise<RegisterUserResponseDto>;
}

export class RegisterUserUseCase implements IRegisterUserUseCase {
    public constructor(
        private readonly userService: IUserService,
        private readonly licensesService: ILicensesService,
        private readonly prisma: PrismaService,
        private readonly logger: ILogger
    ) {}

    /**
     * Execute - регистрация пользователя
     *
     * @param {RegisterUserDto} data - данные для регистрации
     * @returns {Promise<string>} - id зарегистрированного пользователя
     *
     * @throws {AppError} - если пользователь уже зарегистрирован
     */
    public async execute(data: RegisterUserDto): Promise<RegisterUserResponseDto> {
        const isExist = await this.userService.isExistUserByParams({
            OR: [{email: data.email}, {name: data.name}],
            AND: [{active: UserActivity.ACTIVE}]
        });

        if (isExist) {
            throw new AppError(ApiErrors.USER_IS_ALREADY_REGISTERED, 400);
        }

        try {
            return await this.prisma.$transaction(async tx => {
                const user = await this.userService.register(data, tx);
                this.logger.info(`User with id ${user.id} created`);
                await this.licensesService.register(user.id, tx);

                return user;
            });
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            } else if (error instanceof Error) {
                this.logger.error(error.message);
            }

            throw new AppError(ApiErrors.USER_CREATE_ERROR, 500);
        }
    }
}
