export const SERVER_CONFIG = {
    port: Number(process.env.APP_PORT) || 3000,
    host: '0.0.0.0'
} as const;
