import { IsOptional, IsString, MinLength, IsIn } from 'class-validator';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string;

  @IsOptional()
  @IsString()
  @IsIn(['VENDOR', 'DRIVER'], )
  rol?: string; 
}
