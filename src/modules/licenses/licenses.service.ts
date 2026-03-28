import {AppError} from '@/utils/error-handler';
import {ILicensesRepository} from './licenses.repository';
import {ApiErrors} from '@/utils/enums/errors';
import {Prisma} from '@prisma/client';
import {ILogger} from '@/core/container';

export interface ILicensesService {
    register(userId: string, tx?: Prisma.TransactionClient): Promise<void>;
}

export class LicensesService implements ILicensesService {
    public constructor(
        private readonly LicensesRepository: ILicensesRepository,
        private readonly logger: ILogger
    ) {}

    public async register(userId: string, tx?: Prisma.TransactionClient): Promise<void> {
        const license = await this.LicensesRepository.create(userId, tx);

        if (!license) {
            this.logger.warn(`${ApiErrors.LICENSE_CREATE_ERROR}, userId: ${userId}`);
            throw new AppError(ApiErrors.LICENSE_CREATE_ERROR, 500);
        }

        this.logger.info(`License with id ${license.id} created. userId: ${userId}`);
        return;
    }
}
