export const ApiErrors = {
    // ===========================
    // Общие ошибки
    // ===========================

    INTERNAL_SERVER_ERROR: 'Внутренняя ошибка сервера',

    // ===========================
    // Пользователи
    // ===========================

    USER_NOT_FOUND: 'Пользователь не найден или не активен',
} as const;

export type ApiErrors = (typeof ApiErrors)[keyof typeof ApiErrors];