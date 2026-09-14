import {RedisService} from '@/redis/redis.service';

export interface IRefreshTokenRepository {
    save(token: string, userId: string, ttlSeconds: number): Promise<void>;
    getUserId(token: string): Promise<string | null>;
    remove(token: string): Promise<void>;
}

const refreshTokenKey = (token: string): string => `refresh_token:${token}`;

export class RefreshTokenRepository implements IRefreshTokenRepository {
    public constructor(private readonly redis: RedisService) {}

    public async save(token: string, userId: string, ttlSeconds: number): Promise<void> {
        await this.redis.getClient().set(refreshTokenKey(token), userId, 'EX', ttlSeconds);
    }

    public async getUserId(token: string): Promise<string | null> {
        return await this.redis.getClient().get(refreshTokenKey(token));
    }

    public async remove(token: string): Promise<void> {
        await this.redis.getClient().del(refreshTokenKey(token));
    }
}
