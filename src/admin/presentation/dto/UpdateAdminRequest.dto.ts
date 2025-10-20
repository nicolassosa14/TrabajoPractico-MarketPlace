import { IsEmail, IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export default class UpdateAdminRequestDTO {
  @IsString()
  @IsNotEmpty()
  id: string; 

  @IsEmail()
  @IsOptional()
  email?: string;

   @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  @IsIn(['vendor', 'driver'])
  role?: string;
}
