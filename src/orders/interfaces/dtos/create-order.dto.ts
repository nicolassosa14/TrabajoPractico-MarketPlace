import { IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    userId: string;

    @IsString()
    vendorId: string;

    @IsString()
    addressId: string;

    @IsNumber()
    subtotal: number;

    @IsNumber()
    deliveryFee: number;

    @IsNumber()
    discountApplied: number;

    @IsNumber()
    taxes: number;

    @IsNumber()
    totalAmount: number;
}