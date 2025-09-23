import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Max,
  IsEmail,
  IsDate,
} from 'class-validator';

export default class CreateUserRequestDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
