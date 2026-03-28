import {Type} from 'class-transformer';
import {IsString, IsNotEmpty, IsNumber} from 'class-validator';

export class UserRequestQueryByIdDto {
    @IsString({message: 'id must be a string'})
    @IsNotEmpty({message: 'id parameter is required'})
    @Type(() => String)
    id: string;
}

export class UserRequestQuery {
    @IsString({message: 'name must be a string'})
    @IsNotEmpty({message: 'name parameter is required'})
    @Type(() => String)
    name: string;
}

export class RegisterUserDto {
    @IsString({message: 'name must be a string'})
    @IsNotEmpty({message: 'name parameter is required'})
    @Type(() => String)
    name: string;

    @IsString({message: 'email must be a string'})
    @IsNotEmpty({message: 'email parameter is required'})
    @Type(() => String)
    email: string;

    @IsNumber()
    @IsNotEmpty({message: 'age parameter is required'})
    @Type(() => Number)
    age: number;
}
