export const SERVER_CONFIG = {
    port: Number(process.env.APP_PORT) || 3000,
    node: process.env.NODE_ENV || "dev",
    host: '0.0.0.0'
} as const;
