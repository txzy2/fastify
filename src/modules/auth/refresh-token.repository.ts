import {createHash} from 'node:crypto';
import {RedisService} from '@/redis/redis.service';

export interface IRefreshTokenRepository {
    save(token: string, userId: string, ttlSeconds: number): Promise<void>;
    getUserId(token: string): Promise<string | null>;
    getUsedUserId(token: string): Promise<string | null>;
    markUsed(token: string, userId: string, ttlSeconds: number): Promise<void>;
    remove(token: string): Promise<void>;
    removeAllForUser(userId: string): Promise<void>;
}

const tokenKey = (hash: string): string => `refresh_token:${hash}`;
const usedTokenKey = (hash: string): string => `refresh_token_used:${hash}`;
const userTokensKey = (userId: string): string => `refresh_user:${userId}`;

export class RefreshTokenRepository implements IRefreshTokenRepository {
    public constructor(private readonly redis: RedisService) {}

    public async save(token: string, userId: string, ttlSeconds: number): Promise<void> {
        const hash = this.hash(token);

        await this.redis
            .getClient()
            .multi()
            .set(tokenKey(hash), userId, 'EX', ttlSeconds)
            .sadd(userTokensKey(userId), hash)
            .expire(userTokensKey(userId), ttlSeconds)
            .exec();
    }

    public async getUserId(token: string): Promise<string | null> {
        return await this.redis.getClient().get(tokenKey(this.hash(token)));
    }

    public async getUsedUserId(token: string): Promise<string | null> {
        return await this.redis.getClient().get(usedTokenKey(this.hash(token)));
    }

    public async markUsed(token: string, userId: string, ttlSeconds: number): Promise<void> {
        await this.redis
            .getClient()
            .set(usedTokenKey(this.hash(token)), userId, 'EX', ttlSeconds);
    }

    public async remove(token: string): Promise<void> {
        const hash = this.hash(token);
        const client = this.redis.getClient();
        const userId = await client.get(tokenKey(hash));

        await client.del(tokenKey(hash));

        if (userId) {
            await client.srem(userTokensKey(userId), hash);
        }
    }

    public async removeAllForUser(userId: string): Promise<void> {
        const client = this.redis.getClient();
        const hashes = await client.smembers(userTokensKey(userId));

        const pipeline = client.multi();
        for (const hash of hashes) {
            pipeline.del(tokenKey(hash));
        }
        pipeline.del(userTokensKey(userId));

        await pipeline.exec();
    }

    private hash(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }
}
