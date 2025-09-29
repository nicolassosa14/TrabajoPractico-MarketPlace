import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  num_telefono?: number;

  @IsOptional()
  @IsString()
  cod_area?: number;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
