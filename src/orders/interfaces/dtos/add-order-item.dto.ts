import { IsString, IsNumber } from "class-validator";

export class AddOrderItemDto {
    @IsString()
    orderId: string;

    @IsString()
    productId: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    price_at_purchase: number;
}