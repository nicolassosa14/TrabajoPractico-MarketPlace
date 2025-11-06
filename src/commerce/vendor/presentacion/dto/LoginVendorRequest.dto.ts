import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export default class LoginVendorRequestDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}