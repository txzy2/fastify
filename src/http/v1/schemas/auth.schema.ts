import {FastifySchema} from 'fastify';

const errorResponse = (description: string) => ({
    description,
    type: 'object',
    properties: {
        success: {type: 'boolean'},
        version: {type: 'string'},
        error: {type: 'string'}
    }
});

const tokensResponse = {
    description: 'Access и refresh токены',
    type: 'object',
    properties: {
        success: {type: 'boolean'},
        version: {type: 'string'},
        data: {
            type: 'object',
            properties: {
                access_token: {type: 'string'},
                refresh_token: {type: 'string'}
            }
        }
    }
};

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
                version: {type: 'string'},
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
        400: errorResponse('Validation error or user already exists'),
        500: errorResponse('Internal server error')
    }
};

export const loginUserSchema: FastifySchema = {
    tags: ['Auth'],
    summary: 'Sign in user',
    description: 'Authenticates a user and returns access and refresh tokens',
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {type: 'string', format: 'email'},
            password: {type: 'string'}
        }
    },
    response: {
        200: tokensResponse,
        400: errorResponse('Validation error'),
        401: errorResponse('Invalid credentials'),
        500: errorResponse('Internal server error')
    }
};

export const refreshTokenSchema: FastifySchema = {
    tags: ['Auth'],
    summary: 'Refresh tokens',
    description: 'Exchanges a valid refresh token for a new token pair (rotation)',
    body: {
        type: 'object',
        required: ['refresh_token'],
        properties: {
            refresh_token: {type: 'string'}
        }
    },
    response: {
        200: tokensResponse,
        400: errorResponse('Validation error'),
        401: errorResponse('Invalid refresh token'),
        500: errorResponse('Internal server error')
    }
};

export const logoutSchema: FastifySchema = {
    tags: ['Auth'],
    summary: 'Logout',
    description: 'Revokes the provided refresh token',
    body: {
        type: 'object',
        required: ['refresh_token'],
        properties: {
            refresh_token: {type: 'string'}
        }
    },
    response: {
        200: {
            description: 'Logged out',
            type: 'object',
            properties: {
                success: {type: 'boolean'},
                version: {type: 'string'},
                data: {
                    type: 'object',
                    properties: {
                        message: {type: 'string'}
                    }
                }
            }
        },
        400: errorResponse('Validation error'),
        500: errorResponse('Internal server error')
    }
};
