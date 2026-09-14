export class UserRequestQueryByIdDto {
    id: string;
}

export interface RegisterUserDto {
    name: string;
    email: string;
    age: number;
    password: string;
}

export interface LoginUserDto {
    email: string;
    password: string;
}

export interface RefreshTokenDto {
    refresh_token: string;
}
