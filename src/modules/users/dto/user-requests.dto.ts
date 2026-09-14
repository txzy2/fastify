export class UserRequestQueryByIdDto {
    id: string;
}

export class UserRequestQueryByNameDto {
    name: string;
}

export interface RegisterUserDto {
    name: string;
    email: string;
    age: number;
    password: string;
}
