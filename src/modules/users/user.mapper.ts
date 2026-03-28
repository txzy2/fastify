import {Users} from '@prisma/client';
import {RegisterUserResponseDto, UserResponseDto} from './dto/user-response.dto';

export const mapUserFromRepoToDto = (user: Users): UserResponseDto => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.active,
        age: user.age,
        created_at: user.createdAt,
        updated_at: user.updatedAt
    };
};

export const mapRegisterUserToDto = (user: Users): RegisterUserResponseDto => ({
    id: user.id,
    created_at: user.createdAt,
    updated_at: user.updatedAt
});
