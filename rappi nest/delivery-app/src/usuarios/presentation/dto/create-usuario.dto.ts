import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsNotEmpty()
  num_telefono: number;

  @IsNotEmpty()
  cod_area: number;
}
