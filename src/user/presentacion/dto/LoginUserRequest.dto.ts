import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MinLength,
} from 'class-validator';

export default class LoginUserRequestDTO {
    @IsEmail({},{ message: 'El email no es válido' })
    @IsNotEmpty({ message: 'El email no debe estar vacío' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña no debe estar vacía' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
}