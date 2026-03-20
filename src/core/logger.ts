import path from 'path';
import {FastifyServerOptions} from 'fastify';

const isDev = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development';
const logsDir = path.join(process.cwd(), 'logs');

const fileTargets = [
    {
        target: 'pino-roll',
        level: 'info',
        options: {
            file: path.join(logsDir, 'app.log'),
            frequency: 'daily',
            dateFormat: 'yyyy-MM-dd',
            mkdir: true,
            limit: {count: 30}
        }
    },
    {
        target: 'pino-roll',
        level: 'error',
        options: {
            file: path.join(logsDir, 'error.log'),
            frequency: 'daily',
            dateFormat: 'yyyy-MM-dd',
            mkdir: true,
            limit: {count: 30}
        }
    }
];

export const LOGGER_CONFIG: FastifyServerOptions['logger'] = {
    level: process.env.LOGGER_LEVEL || 'info',
    transport: {
        targets: [
            ...(isDev ? [{target: 'pino-pretty', level: 'info', options: {}}] : []),
            ...fileTargets
        ]
    }
};
