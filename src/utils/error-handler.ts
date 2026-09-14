import {ApiErrors} from './enums/errors';

export class AppError extends Error {
    constructor(
        public error: ApiErrors | string,
        public statusCode: number = 500
    ) {
        super(error);
        this.name = 'AppError';
    }
}
