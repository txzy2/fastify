import Redis from 'ioredis';

export class RedisService {
    private readonly client: Redis;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASS,
            lazyConnect: true,
            maxRetriesPerRequest: 3
        });
    }

    getClient(): Redis {
        return this.client;
    }

    async connect(): Promise<void> {
        await this.client.connect();
    }

    async disconnect(): Promise<void> {
        await this.client.quit();
    }
}
