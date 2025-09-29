import { IsEmail, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export class AdminCreateUserDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsIn(['vendor', 'driver'])
  rol: 'vendor' | 'driver';
}
