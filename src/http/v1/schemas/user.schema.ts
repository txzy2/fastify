import {SERVER_CONFIG} from '@/core/config';
import {FastifySchema} from 'fastify';

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
        success: {type: 'boolean'},
        error: {type: 'string'}
    }
};

export const getUserSchema: FastifySchema = {
    summary: 'Get user by name',
    description: 'Returns a single user matched by name',
    tags: ['Users'],
    querystring: {
        type: 'object',
        properties: {
            name: {type: 'string', minLength: 1}
        },
        required: ['name']
    },
    response: {
        200: {
            description: 'User found successfully',
            type: 'object',
            properties: {
                success: {type: 'boolean'},
                data: {
                    type: 'object',
                    properties: {
                        id: {type: 'string', format: 'uuid'},
                        name: {type: 'string'},
                        age: {type: 'number'}
                    }
                }
            }
        },
        404: UserNotFoundApiError
    }
};

export const getUserByIdSchema: FastifySchema = {
    summary: 'Get user by ID',
    description: 'Returns a single user matched by UUID',
    tags: ['Users'],
    params: {
        type: 'object',
        properties: {
            id: {type: 'string', format: 'uuid'}
        },
        required: ['id']
    },
    response: {
        200: {
            description: 'User found successfully',
            type: 'object',
            properties: {
                success: {type: 'boolean'},
                data: {
                    type: 'object',
                    properties: {
                        id: {type: 'string', format: 'uuid'},
                        name: {type: 'string'},
                        age: {type: 'number'}
                    }
                }
            }
        },
        404: UserNotFoundApiError
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
