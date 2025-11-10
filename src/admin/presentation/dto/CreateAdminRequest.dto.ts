import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator';

export default class CreateAdminRequestDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsIn(['vendor', 'driver'])
  role: string;
}
