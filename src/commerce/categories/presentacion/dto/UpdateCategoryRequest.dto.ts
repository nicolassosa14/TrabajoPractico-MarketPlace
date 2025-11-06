import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryRequestDto } from './CrearCategoriaRequest.dto';
import { IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator';

export class UpdateCategoryRequestDto extends PartialType(
  CreateCategoryRequestDto,
) {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
}
