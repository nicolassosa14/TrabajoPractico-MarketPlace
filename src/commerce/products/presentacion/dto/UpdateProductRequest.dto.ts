import { PartialType } from '@nestjs/mapped-types';
import { CreateProductRequestDTO } from './CreateProductRequest.dto';

export class UpdateProductDto extends PartialType(CreateProductRequestDTO) {}
