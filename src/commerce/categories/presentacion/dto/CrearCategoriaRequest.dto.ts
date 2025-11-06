import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
