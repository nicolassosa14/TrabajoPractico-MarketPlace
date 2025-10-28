import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEmail,
  IsOptional,
} from 'class-validator';

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
    @IsString()
    phone_number?: string;

    @IsString()
    @IsNotEmpty({ message: 'El user_id es obligatorio' })
    user_id:string;
}