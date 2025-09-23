import {
    IsString,
    IsNotEmpty,
    IsEmail,
} from 'class-validator';

export default class LoginUserRequestDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}