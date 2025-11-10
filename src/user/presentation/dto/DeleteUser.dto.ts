import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Max,
  IsEmail,
  IsDate,
} from 'class-validator';

export default class DeleteUserRequestDTO{
    @IsString()
    @IsNotEmpty({ message: 'El user_id es obligatorio' })
    user_id: string;
}



