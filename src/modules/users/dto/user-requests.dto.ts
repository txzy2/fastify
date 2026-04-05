export class UserRequestQueryByIdDto {
    id: string;
}

export class UserRequestQuery {
    name: string;
}

export interface RegisterUserDto {
    name: string;
    email: string;
    age: number;
    password: string;
}
