import {
  IsString,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export default class CreateUserRequestDTO {
  @IsEmail()
  @IsNotEmpty({ message: 'El email es obligatorio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  first_name: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  last_name: string;

}
