import { IsNumber, IsString } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  userId: string;

  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
}
