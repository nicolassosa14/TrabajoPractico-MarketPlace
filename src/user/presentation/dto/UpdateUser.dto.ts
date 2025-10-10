import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEmail,
  IsOptional,
} from 'class-validator';

export default class PutUserRequestDTO{
  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  phone_number?: number;
}

export class PatchUserRequestDTO{
    @IsOptional()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @IsOptional()
    @IsNumber()
    phone_number?: number;

    @IsString()
    @IsNotEmpty({ message: 'El user_id es obligatorio' })
    user_id:string;
}