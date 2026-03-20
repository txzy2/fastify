import {Users} from '@prisma/client';
import {IUserRepository} from './user.repository';
import {AppError} from '@/utils/error-handler';
import {ApiErrors} from '@/utils/enums/errors';

export interface IUserService {
    findByName(name: string): Promise<Users>;
    findById(id: string): Promise<Users>;
}

export class UserService implements IUserService {
    /**
     * UserService Constructor
     *
     * @param userStorarge
     */
    public constructor(private readonly userRepository: IUserRepository) {}

    /**
     * findByName - Поиск пользователя по имени
     *
     * @param {string} name
     * @returns {Promise<Users>}
     */
    public async findByName(name: string): Promise<Users> {
        const existUser = await this.userRepository.getByName(name);
        if (!existUser) {
            throw new AppError(ApiErrors.USER_NOT_FOUND, 404);
        }

        return existUser;
    }

    /**
     * findById - Поиск пользователя по id
     *
     * @param {string} id - id пользователя
     *
     * @returns {Promise<User>} - User или ошибка, если пользователь не найден
     *
     * @throws {AppError} - если пользователь не найден
     */
    public async findById(id: string): Promise<Users> {
        const existUser = await this.userRepository.getById(id);
        if (!existUser) {
            throw new AppError(ApiErrors.USER_NOT_FOUND, 404);
        }

        return existUser;
    }
}
