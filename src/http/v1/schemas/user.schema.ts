import {SERVER_CONFIG} from '@/core/config';
import {FastifySchema} from 'fastify';

const UUID_PATTERN = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

export const openApiDocs = {
    info: {
        title: process.env.APP_NAME || 'Fastify app',
        description: 'API documentation',
        version: SERVER_CONFIG.app_version
    },
    servers: [{url: `http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`}]
};

export const UserNotFoundApiError = {
    description: 'User not found',
    type: 'object',
    properties: {
        success: {type: 'boolean', example: false},
        error: {type: 'string', example: 'User not found'},
        version: {type: 'string'}
    },
    required: ['success', 'error']
};

export const ValidationError = {
    description: 'Validation error',
    type: 'object',
    properties: {
        success: {type: 'boolean', example: false},
        error: {type: 'string', example: 'Validation failed'},
        version: {type: 'string'},
        details: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    field: {type: 'string'},
                    message: {type: 'string'}
                }
            }
        }
    },
    required: ['success', 'error']
};

const UserDataSchema = {
    type: 'object',
    properties: {
        id: {type: 'string', format: 'uuid', pattern: UUID_PATTERN},
        name: {type: 'string'},
        email: {type: 'string'},
        age: {type: 'number'},
        active: {type: 'string', enum: ['ACTIVE', 'INACTIVE', 'BANNED']},
        created_at: {type: 'string', format: 'date-time'},
        updated_at: {type: 'string', format: 'date-time'}
    },
    required: ['id', 'name', 'email', 'age', 'active', 'created_at', 'updated_at']
};

const SuccessResponseSchema = {
    type: 'object',
    properties: {
        success: {type: 'boolean', example: true},
        data: UserDataSchema,
        version: {type: 'string'}
    },
    required: ['success', 'data']
};

const ParamsSchema = {
    type: 'object',
    properties: {
        id: {type: 'string', format: 'uuid', pattern: UUID_PATTERN}
    },
    required: ['id']
};

const InternalServerErrorApiError = {
    description: 'Internal server error',
    type: 'object',
    properties: {
        success: {type: 'boolean', example: false},
        error: {type: 'string', example: 'Internal server error'},
        version: {type: 'string'}
    },
    required: ['success', 'error']
};

export const getUserByIdSchema: FastifySchema = {
    summary: 'Get user by ID',
    description: 'Returns a single user matched by UUID',
    tags: ['Users'],
    params: ParamsSchema,

    response: {
        200: SuccessResponseSchema,
        400: ValidationError,
        404: UserNotFoundApiError,
        500: InternalServerErrorApiError
    }
};

