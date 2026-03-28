export const ApiErrors = {
    // ===========================
    // Общие ошибки
    // ===========================

    INTERNAL_SERVER_ERROR: 'Внутренняя ошибка сервера',

    // ===========================
    // Пользователи
    // ===========================

    USER_NOT_FOUND: 'Пользователь не найден или не активен',
    USER_IS_ALREADY_REGISTERED: 'Пользователь уже зарегистрирован',
    USER_CREATE_ERROR: 'Ошибка при создании пользователя',

    // ===========================
    // Лицензии
    // ===========================

    LICENSE_NOT_FOUND: 'Лицензия не найдена',
    LICENSE_ALREADY_REGISTERED: 'Лицензия уже зарегистрирована',
    LICENSE_NOT_REGISTERED: 'Лицензия не зарегистрирована',
    LICENSE_CREATE_ERROR: 'Ошибка при создании лицензии'
} as const;

export type ApiErrors = (typeof ApiErrors)[keyof typeof ApiErrors];
