import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export default class CreateUserRequestDTO {
  @IsEmail({}, { message: 'El email no es válido.' })
  @IsNotEmpty({ message: 'El email es obligatorio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  first_name: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  last_name: string;
}
