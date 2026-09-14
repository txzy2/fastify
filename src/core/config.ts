export const SERVER_CONFIG = {
    app_version: process.env.APP_VERSION || 'v1.0.0',
    port: Number(process.env.APP_PORT) || 3000,
    node: process.env.NODE_ENV || 'dev',
    host: '0.0.0.0',
    jwt: {
        secret: process.env.JWT_SECRET || 'dev_insecure_secret_change_me',
        accessTtl: process.env.JWT_ACCESS_TTL || '15m',
        refreshTtlSeconds: Number(process.env.JWT_REFRESH_TTL) || 60 * 60 * 24 * 7
    }
} as const;
