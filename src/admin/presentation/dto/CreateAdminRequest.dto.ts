import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class CreateAdminRequestDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;  

  @IsString()
  @IsNotEmpty()
  password: string; 

  @IsString()
  @IsNotEmpty()
  role: string; 
}
