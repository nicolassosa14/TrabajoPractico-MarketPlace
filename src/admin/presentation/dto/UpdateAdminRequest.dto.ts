import { IsEmail, IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';

export default class UpdateAdminRequestDTO {
  @IsString()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsIn(['vendor', 'driver'])
  role: string;
}
