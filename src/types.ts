import {FastifyReply, RouteGenericInterface} from 'fastify';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    version: string;
}

export type ApiReply<T> = FastifyReply<
    RouteGenericInterface & {
        Reply: ApiResponse<T>;
    }
>;
