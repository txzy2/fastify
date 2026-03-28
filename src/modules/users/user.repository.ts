import {PrismaService} from '@/prisma/prisma.service';
import {Prisma, UserActivity, Users} from '@prisma/client';
import {RegisterUserDto} from './dto/user-requests.dto';

export interface IUserRepository {
    getById(id: string): Promise<Users | null>;
    getByName(name: string): Promise<Users | null>;
    getByParams(
        params: Prisma.UsersWhereInput,
        tx?: Prisma.TransactionClient
    ): Promise<Users | null>;

    create(data: RegisterUserDto, tx?: Prisma.TransactionClient): Promise<Users | null>;
}

export class UserRepository implements IUserRepository {
    public constructor(private readonly prisma: PrismaService) {}

    /**
     * Найти пользователя по ID.
     *
     * @param {string} id - ID пользователя.
     *
     * @returns {Promise<Users | null>} - Объект Users, если пользователь найден, или null, если не найден.
     */
    public async getById(id: string): Promise<Users | null> {
        return await this.prisma.users.findUnique({where: {id}});
    }

    /**
     * Найти пользователя по имени.
     *
     * @param {string} name - Имя пользователя.
     *
     * @returns {Promise<Users | null>} - Объект Users, если пользователь найден, или null, если не найден.
     */
    public async getByName(name: string): Promise<Users | null> {
        return await this.prisma.users.findUnique({where: {name}});
    }

    /**
     * Найти пользователя по параметрам.
     *
     * @param {Prisma.UsersWhereInput} params - Параметры для поиска.
     *
     * @returns {Promise<Users | null>} - Объект Users, если пользователь найден, или null, если не найден.
     */
    public async getByParams(params: Prisma.UsersWhereInput): Promise<Users | null> {
        return await this.prisma.users.findFirst({where: params});
    }

    /**
     * create - Создание пользователя
     *
     * @param {RegisterUserDto} data
     * @param {Prisma.TransactionClient} tx
     * @returns {Promise<Users>}
     */
    public async create(
        data: RegisterUserDto,
        tx?: Prisma.TransactionClient
    ): Promise<Users | null> {
        const client = tx ?? this.prisma;

        return await client.users.create({
            data: {
                name: data.name,
                age: data.age,
                email: data.email,
                active: UserActivity.ACTIVE
            }
        });
    }
}
