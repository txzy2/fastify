import {UserActivity} from '@prisma/client';

export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    age: number;
    active: UserActivity;
    created_at: Date;
    updated_at: Date;
}

export interface RegisterUserResponseDto {
    id: string;
    created_at: Date;
    updated_at: Date;
}

export interface LoginUserResponseDto {
    access_token: string;
    refresh_token: string;
}

export interface LogoutResponseDto {
    message: string;
}
