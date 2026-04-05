import {PrismaService} from '@/prisma/prisma.service';
import {Licenses, Prisma} from '@prisma/client';

export interface ILicensesRepository {
    create(userId: string, tx?: Prisma.TransactionClient): Promise<Licenses | null>;
}

const LICENSE_DURATION_MONTHS = 1;

export class LicensesRepository implements ILicensesRepository {
    public constructor(private readonly prisma: PrismaService) {}

    /**
     * create - Создание лицензии
     *
     * @param {string} userId
     * @param {Prisma.TransactionClient} tx
     *
     * @returns {Promise<Licenses>}
     */
    public async create(userId: string, tx?: Prisma.TransactionClient): Promise<Licenses | null> {
        const client = tx ?? this.prisma;
        const date = new Date();

        return await client.licenses.create({
            data: {
                userId,
                startsAt: date,
                endsAt: new Date(new Date(date).setMonth(date.getMonth() + LICENSE_DURATION_MONTHS))
            }
        });
    }
}
