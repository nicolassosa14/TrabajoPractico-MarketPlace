import { IsString, IsNotEmpty, IsNumber, Max, IsEmail } from 'class-validator';

export class createVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Max(100)
  age: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
