import {SERVER_CONFIG} from '@/core/config';
import {ApiResponse} from '@/types';

/**
 * Формирует успешный ответ API, автоматически подставляя версию приложения.
 *
 * @example
 * reply.status(200).send(apiSuccess(user));
 */
export const apiSuccess = <T>(data: T): ApiResponse<T> => ({
    success: true,
    data,
    version: SERVER_CONFIG.app_version
});

/**
 * Формирует ответ с ошибкой, автоматически подставляя версию приложения.
 *
 * @example
 * reply.status(404).send(apiError(ApiErrors.USER_NOT_FOUND));
 */
export const apiError = (error: string): ApiResponse<never> => ({
    success: false,
    error,
    version: SERVER_CONFIG.app_version
});
