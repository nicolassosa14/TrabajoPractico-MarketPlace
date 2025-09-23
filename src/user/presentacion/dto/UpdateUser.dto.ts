import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEmail,
  IsOptional,
} from 'class-validator';

export default class PutUserRequestDTO{
    @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  phone: number;
}

export class PathcUserRequestDTO{
    @IsOptional()
    @IsString()
    
    name?: string;
    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @IsOptional()
    @IsNumber()
    
    phone?: number;
}