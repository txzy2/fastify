export const SERVER_CONFIG = {
    app_version: process.env.APP_VERSION || 'v1.0.0',
    port: Number(process.env.APP_PORT) || 3000,
    node: process.env.NODE_ENV || 'dev',
    host: '0.0.0.0'
} as const;
