import {Type} from 'class-transformer';
import {IsNotEmpty, IsString} from 'class-validator';

export class ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

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
