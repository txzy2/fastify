import {FastifySchema} from 'fastify';

export const registerUserSchema: FastifySchema = {
    tags: ['Auth'],
    summary: 'Register a new user',
    description: 'Creates a new user and generates a license for them',
    body: {
        type: 'object',
        required: ['name', 'email', 'age', 'password'],
        properties: {
            name: {type: 'string'},
            email: {type: 'string', format: 'email'},
            age: {type: 'number'},
            password: {type: 'string'}
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
