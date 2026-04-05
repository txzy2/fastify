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
            ...(isDev
                ? [
                      {
                          target: 'pino-pretty',
                          level: 'debug',
                          options: {
                              colorize: true,
                              translateTime: 'HH:MM:ss',
                              ignore: 'pid,hostname,reqId',
                              messageFormat: '{msg}'
                          }
                      }
                  ]
                : []),
            ...fileTargets,
            {
                target: 'pino-loki',
                level: 'debug',
                options: {
                    host: process.env.LOKI_HOST || 'http://127.0.0.1:3100',
                    labels: {
                        app: 'fastify',
                        job: 'fastify',
                        env: process.env.NODE_ENV || 'dev'
                    },
                    batching: true,
                    interval: 5 // отправка каждые 5 сек
                }
            }
        ]
    }
};
