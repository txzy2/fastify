import {SERVER_CONFIG} from '@/core/config';
import {FastifySchema} from 'fastify';

const UUID_PATTERN = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

export const openApiDocs = {
    info: {
        title: process.env.APP_NAME || 'Fastify app',
        description: 'API documentation',
        version: '1.0.0'
    },
    servers: [{url: `http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`}]
};

export const UserNotFoundApiError = {
    description: 'User not found',
    type: 'object',
    properties: {
        success: {type: 'boolean', example: false},
        error: {type: 'string', example: 'User not found'}
    },
    required: ['success', 'error']
};

export const ValidationError = {
    description: 'Validation error',
    type: 'object',
    properties: {
        success: {type: 'boolean', example: false},
        error: {type: 'string', example: 'Validation failed'},
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
        id: {
            type: 'string',
            format: 'uuid',
            pattern: UUID_PATTERN,
            example: '550e8400-e29b-41d4-a716-446655440000'
        },
        name: {type: 'string', example: 'John Doe'},
        age: {type: 'number', example: 30}
    },
    required: ['id', 'name', 'age']
};

const SuccessResponseSchema = {
    type: 'object',
    properties: {
        success: {type: 'boolean', example: true},
        data: UserDataSchema
    },
    required: ['success', 'data']
};

const QueryStringSchema = {
    type: 'object',
    properties: {
        name: {type: 'string', minLength: 1}
    },
    required: ['name']
};

const ParamsSchema = {
    type: 'object',
    properties: {
        id: {type: 'string', format: 'uuid', pattern: UUID_PATTERN}
    },
    required: ['id']
};

export const getUserSchema: FastifySchema = {
    summary: 'Get user by name',
    description: 'Returns a single user matched by name',
    tags: ['Users'],
    querystring: QueryStringSchema,
    response: {
        200: SuccessResponseSchema,
        400: ValidationError,
        404: UserNotFoundApiError,
        500: {
            description: 'Internal server error',
            type: 'object',
            properties: {
                success: {type: 'boolean', example: false},
                error: {type: 'string', example: 'Internal server error'}
            },
            required: ['success', 'error']
        }
    }
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
        500: {
            description: 'Internal server error',
            type: 'object',
            properties: {
                success: {type: 'boolean', example: false},
                error: {type: 'string', example: 'Internal server error'}
            },
            required: ['success', 'error']
        }
    }
};

export const registerUserSchema: FastifySchema = {
    tags: ['Users'],
    summary: 'Register a new user',
    description: 'Creates a new user and generates a license for them',
    body: {
        type: 'object',
        required: ['name', 'email', 'age'],
        properties: {
            name: {type: 'string'},
            email: {type: 'string', format: 'email'},
            age: {type: 'number'}
        }
    },
    response: {
        201: {
            description: 'User successfully registered',
            type: 'object',
            properties: {
                success: {type: 'boolean'},
                data: {
                    type: 'object',
                    properties: {
                        id: {type: 'string', format: 'uuid'},
                        created_at: {type: 'string', format: 'date-time'},
                        updated_at: {type: 'string', format: 'date-time'}
                    }
                }
            }
        },
        400: {
            description: 'Validation error or user already exists',
            type: 'object',
            properties: {
                success: {type: 'boolean'},
                error: {type: 'string'}
            }
        },
        500: {
            description: 'Internal server error',
            type: 'object',
            properties: {
                success: {type: 'boolean'},
                error: {type: 'string'}
            }
        }
    }
};
