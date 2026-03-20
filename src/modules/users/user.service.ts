import {IUserRepository} from './user.repository';
import {ApiErrors} from '@/utils/enums/errors';
import {RegisterUserResponseDto, UserResponseDto} from './dto/user-response.dto';
import {mapRegisterUserToDto, mapUserFromRepoToDto} from './user.mapper';
import {Prisma, UserActivity} from '@prisma/client';
import {RegisterUserDto} from './dto/user-requests.dto';
import {ILogger} from '@/core/container';
import { AppError } from '@/utils/error-handler';

export interface IUserService {
    findByName(name: string): Promise<UserResponseDto>;
    findById(id: string): Promise<UserResponseDto>;
    findByParamsOrThrow(
        params: Prisma.UsersWhereInput,
        tx?: Prisma.TransactionClient
    ): Promise<UserResponseDto>;

    isExistUserByParams(
        params: Prisma.UsersWhereInput,
        tx?: Prisma.TransactionClient
    ): Promise<boolean>;

    register(
        data: RegisterUserDto,
        tx?: Prisma.TransactionClient
    ): Promise<RegisterUserResponseDto>;
}

export class UserService implements IUserService {
    /**
     * UserService Constructor
     *
     * @param userStorarge
     */
    public constructor(
        private readonly userRepository: IUserRepository,
        private readonly logger: ILogger
    ) {}

    /**
     * findByName - Поиск пользователя по имени
     *
     * @param {string} name
     * @returns {Promise<UserResponseDto>}
     */
    public async findByName(name: string): Promise<UserResponseDto> {
        const existUser = await this.userRepository.getByName(name);
        if (!existUser || existUser.active !== UserActivity.ACTIVE) {
            this.logger.warn(`User with name ${name} not found`);
            throw new AppError(ApiErrors.USER_NOT_FOUND, 404);
        }

        return mapUserFromRepoToDto(existUser);
    }

    /**
     * findById - Поиск пользователя по id
     *
     * @param {string} id - id пользователя
     *
     * @returns {Promise<UserResponseDto>} - UserResponseDto или ошибка, если пользователь не найден
     *
     * @throws {AppError} - если пользователь не найден
     */
    public async findById(id: string): Promise<UserResponseDto> {
        const existUser = await this.userRepository.getById(id);
        if (!existUser || existUser.active !== UserActivity.ACTIVE) {
            this.logger.warn(`User with id ${id} not found`);
            throw new AppError(ApiErrors.USER_NOT_FOUND, 404);
        }

        return mapUserFromRepoToDto(existUser);
    }

    /**
     * findByParamsOrThrow - Поиск пользователя по параметрам
     *
     * @param {Prisma.UsersWhereInput} params - параметры поиска
     * @param {Prisma.TransactionClient} tx - транзакция
     * @returns {Promise<UserResponseDto>} - UserResponseDto или ошибка, если пользователь не найден
     *
     * @throws {AppError} - если пользователь не найден
     */
    public async findByParamsOrThrow(
        params: Prisma.UsersWhereInput,
        tx?: Prisma.TransactionClient
    ): Promise<UserResponseDto> {
        const existUser = await this.userRepository.getByParams(params, tx);
        if (!existUser || existUser.active !== UserActivity.ACTIVE) {
            this.logger.warn(`User with params ${JSON.stringify(params)} not found`);
            throw new AppError(ApiErrors.USER_NOT_FOUND, 404);
        }

        return mapUserFromRepoToDto(existUser);
    }

    /**
     * isExistUser - Проверка наличия пользователя по параметрам
     *
     * @param {Prisma.UsersWhereInput} params - параметры поиска
     * @param {Prisma.TransactionClient} tx - транзакция
     * @returns {Promise<boolean>} - true, если пользователь найден, false - в противном случае
     */
    public async isExistUserByParams(
        params: Prisma.UsersWhereInput,
        tx?: Prisma.TransactionClient
    ): Promise<boolean> {
        return await this.userRepository.getByParams(params, tx).then(user => !!user);
    }

    /**
     * register - регистрация пользователя
     *
     * @param {RegisterUserDto} data - данные для регистрации
     * @param {Prisma.TransactionClient} tx - транзакция
     *
     * @returns {Promise<RegisterUserResponseDto>} - UserResponseDto или ошибка, если пользователь не зарегистрирован
     *
     * @throws {AppError} - если пользователь не зарегистрирован
     */
    public async register(
        data: RegisterUserDto,
        tx?: Prisma.TransactionClient
    ): Promise<RegisterUserResponseDto> {
        const user = await this.userRepository.create(data, tx);
        if (!user) {
            this.logger.error(ApiErrors.USER_CREATE_ERROR);
            throw new AppError(ApiErrors.USER_CREATE_ERROR, 500);
        }

        return mapRegisterUserToDto(user);
    }
}
