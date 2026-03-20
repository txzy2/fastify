import {PrismaService} from '@/prisma/prisma.service';
import {Users} from '@prisma/client';

export interface IUserRepository {
    getById(id: string): Promise<Users | null>;
    getByName(name: string): Promise<Users | null>;
}

export class UserRepository {
    public constructor(private readonly prisma: PrismaService) {}

    /**
     * Найти пользователя по ID.
     *
     * @param {string} id - ID пользователя.
     *
     * @returns {Promise<Users | null>} - Объект Users, если пользователь найден, или null, если не найден.
     */
    public async getById(id: string): Promise<Users | null> {
        return this.prisma.users.findUnique({where: {id}});
    }

    /**
     * Найти пользователя по имени.
     *
     * @param {string} name - Имя пользователя.
     *
     * @returns {Promise<Users | null>} - Объект Users, если пользователь найден, или null, если не найден.
     */
    public async getByName(name: string): Promise<Users | null> {
        return this.prisma.users.findUnique({where: {name}});
    }
}
