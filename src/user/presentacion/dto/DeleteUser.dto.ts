import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Max,
  IsEmail,
  IsDate,
} from 'class-validator';

export default class DeleteUserRequestDTO{
    @IsNumber()
    @IsNotEmpty()
    id?: number;
    
    @IsString()
    @IsNotEmpty()
    uuid?: string;
}



